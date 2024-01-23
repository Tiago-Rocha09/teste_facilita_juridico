export default class CustomerService {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async getCustomers(params) {
    const customers = await this.customerRepository.getCustomers(params);
    return customers;
  }

  async createCustomer(customer) {
    return await this.customerRepository.createCustomer(customer);
  }
}
