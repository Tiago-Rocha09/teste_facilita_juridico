export class Customer {
  distanceToCompany = null;
  distanceToOthers = [];

  constructor(id, name, email, phone, coordinateX, coordinateY, createdAt) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.id = id;
    this.coordinateX = coordinateX;
    this.coordinateY = coordinateY;
    this.createdAt = createdAt;
    this.distanceToCompany = Customer.calculateDistance(
      0,
      coordinateX,
      0,
      coordinateY
    );
  }

  static create(data) {
    const { name, email, phone, id, coordinate_x, coordinate_y, created_at } =
      data;
    return new Customer(
      id,
      name,
      email,
      phone,
      coordinate_x,
      coordinate_y,
      created_at
    );
  }

  static toJson(customer) {
    const { name, email, phone, coordinateX, coordinateY } = customer;
    return { name, email, phone, coordinateX, coordinateY };
  }

  static calculateDistance(
    coordinateX1,
    coordinateX2,
    coordinateY1,
    coordinateY2
  ) {
    return Math.sqrt(
      Math.pow(coordinateX2 - coordinateX1, 2) +
        Math.pow(coordinateY2 - coordinateY1, 2)
    );
  }

  calculateDistanceToOtherCustomers(listOfCustomers) {
    listOfCustomers.forEach((itemB) => {
      const customerB = Customer.create(itemB);
      this.distanceToOthers.push({
        customerId: customerB.id,
        distance: Customer.calculateDistance(
          this.coordinateX,
          customerB.coordinateX,
          this.coordinateY,
          customerB.coordinateY
        ),
      });
    });
  }
}
