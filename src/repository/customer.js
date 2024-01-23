import pgConnection from "../database/postgre.js";
import { Customer } from "../entities/customer.js";
import { getOnlyNumbers } from "../utils/function.js";

export default class CustomerRepository {
  constructor() {
    this.customerDb = pgConnection;
  }

  async getCustomers(params) {
    const defaultQuery = this.getDefaultQuery();
    let where = [defaultQuery];

    const values = [];
    if (params.search_term) {
      const search = this.getSearchQuery(params.search_term);
      where.push(`(${search.searchQuery})`);
      values.push(...search.searchValues);
    }

    where = where.join(" AND ");
    const res = await this.customerDb.query(
      "SELECT id, name, email, phone, created_at as createdAt FROM customers WHERE " +
        where,
      values
    );
    return res.rows?.map((item) => Customer.create(item));
  }

  async createCustomer(customer) {
    const data = Customer.toJson(customer);

    const { rows } = await this.customerDb.query(
      "INSERT INTO customers (name, email, phone) values ($1, $2, $3)  RETURNING id",
      [data.name, data.email, getOnlyNumbers(data.phone)]
    );
    return rows[0].id;
  }

  getSearchQuery(search_term) {
    const searchebleColumns = ["name", "email", "phone"];

    const searchArray = searchebleColumns.map((item, index) => {
      return `customers.${item} LIKE $${index + 1}`;
    });

    const searchQuery = searchArray.join(" OR ");
    const searchValues = Array(searchebleColumns.length).fill(
      `%${search_term}%`
    );

    return { searchQuery, searchValues };
  }

  getDefaultQuery() {
    return "customers.deleted_at IS NULL";
  }
}
