export class Customer {
  constructor(id, name, email, phone) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.id = id;
  }

  static create(data) {
    const { name, email, phone, id } = data;
    return new Customer(id, name, email, phone);
  }

  static toJson(customer) {
    const { name, email, phone } = customer;
    return { name, email, phone };
  }
}
