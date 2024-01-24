import pgConnection from "../database/postgre.js";
import { Customer } from "../entities/customer.js";
import { getOnlyNumbers } from "../utils/function.js";

export default class CustomerRepository {
  constructor() {
    this.customerDb = pgConnection;
  }

  async getCustomers(params) {
    const { where, values } = this.buildWhereClause(params);

    const res = await this.customerDb.query(
      `SELECT id, name, email, phone, coordinate_x, coordinate_y, created_at 
      FROM customers 
      WHERE ${where}
      ORDER BY id DESC
      `,
      values
    );
    return res.rows?.map((item) => Customer.create(item));
  }

  async createCustomer(customer) {
    const data = Customer.toJson(customer);

    const { rows } = await this.customerDb.query(
      `INSERT INTO customers (name, email, phone, coordinate_x, coordinate_y) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id`,
      [
        data.name,
        data.email,
        getOnlyNumbers(data.phone),
        data.coordinateX,
        data.coordinateY,
      ]
    );
    return rows[0].id;
  }

  async getBestRoute(params) {
    const { where, values } = this.buildWhereClause(params);

    const result = await this.customerDb.query(
      `SELECT id, name, email, phone, coordinate_x, coordinate_y, created_at
      FROM customers 
      WHERE ${where}`,
      values
    );

    let filteredCustomers = result.rows?.map((item) => {
      const customer = Customer.create(item);
      customer.calculateDistanceToOtherCustomers(result.rows);
      return customer;
    });
    filteredCustomers = filteredCustomers.sort(
      (a, b) => a.distanceToCompany - b.distanceToCompany
    );
    const bestRoute = this.calculateBestRoute(filteredCustomers);
    return bestRoute;
  }

  calculateBestRoute(customers) {
    const noVisitedCustomers = [...customers];
    const visitedCustomers = [];
    let totalDistance = 0;

    visitedCustomers.push(noVisitedCustomers.shift());

    while (noVisitedCustomers.length > 0) {
      const currentCustomer = noVisitedCustomers.reduce(
        (minCustomer, customer) => {
          return customer.distanceToCompany < minCustomer.distanceToCompany
            ? customer
            : minCustomer;
        },
        noVisitedCustomers[0]
      );

      for (const adjacentCustomer of currentCustomer.distanceToOthers) {
        const otherCustomer = customers.find(
          (item) => item.id === adjacentCustomer.customerId
        );

        if (
          otherCustomer.distanceToCompany >
          currentCustomer.distanceToCompany + adjacentCustomer.distance
        ) {
          otherCustomer.distanceToCompany =
            currentCustomer.distanceToCompany + adjacentCustomer.distance;
        }
      }

      visitedCustomers.push(currentCustomer);

      const previousCustomer = visitedCustomers[visitedCustomers.length - 2];
      const distanceBetweenCustomers = currentCustomer.distanceToOthers.find(
        (item) => item.customerId === previousCustomer.id
      )?.distance;

      totalDistance += distanceBetweenCustomers;

      const index = noVisitedCustomers.indexOf(currentCustomer);
      if (index !== -1) {
        noVisitedCustomers.splice(index, 1);
      }
    }
    totalDistance +=
      visitedCustomers[visitedCustomers.length - 1].distanceToCompany;
    return { customers: visitedCustomers, totalDistance };
  }

  getSearchQuery(searchTerm) {
    const searchebleColumns = ["name", "email", "phone"];

    const searchArray = searchebleColumns.map((item, index) => {
      return `customers.${item} ILIKE $${index + 1}`;
    });

    const searchQuery = searchArray.join(" OR ");
    const searchValues = Array(searchebleColumns.length).fill(
      `%${searchTerm}%`
    );

    return { searchQuery, searchValues };
  }

  getDefaultQuery() {
    return "customers.deleted_at IS NULL";
  }

  buildWhereClause(params) {
    const defaultQuery = this.getDefaultQuery();
    let where = [defaultQuery];

    const values = [];
    if (params.searchTerm) {
      const search = this.getSearchQuery(params.searchTerm);
      where.push(`(${search.searchQuery})`);
      values.push(...search.searchValues);
    }

    where = where.join(" AND ");

    return { where, values };
  }
}
