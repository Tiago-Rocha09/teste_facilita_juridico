export default class CustomerService {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async getCustomers(params) {
    return await this.customerRepository.getCustomers(params);
  }

  async createCustomer(customer) {
    return await this.customerRepository.createCustomer(customer);
  }

  async getBestRoute(params) {
    return await this.customerRepository.getBestRoute(params);
  }
}
