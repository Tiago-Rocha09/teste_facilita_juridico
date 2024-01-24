import CustomerRepository from "../repository/customer.js";
import CustomerService from "../services/customer.js";

const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);

async function getCustomers(req, res) {
  try {
    const customers = await customerService.getCustomers(req.query);
    res.json(customers);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Erro ao buscar cliente" });
  }
}

async function createCustomer(req, res) {
  try {
    const customerId = await customerService.createCustomer(req.body);
    res.json({ message: "Cliente criado com sucesso", customerId });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar cliente" });
  }
}

async function getBestRoute(req, res) {
  try {
    const customers = await customerService.getBestRoute(req.query);
    res.json(customers);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Erro ao buscar a melhor rota" });
  }
}

export { getCustomers, createCustomer, getBestRoute };
