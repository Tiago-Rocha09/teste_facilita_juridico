import express from "express";
import { checkSchema, validationResult } from "express-validator";
import {
  getCustomers,
  createCustomer,
  getBestRoute,
} from "../controllers/customer.js";
import { createCustomerSchema } from "../schemas/customers.js";

const customersRoutes = express.Router();

customersRoutes.get("/", getCustomers);

customersRoutes.post("/", checkSchema(createCustomerSchema), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    return res.status(400).json({
      errors: [...errors.map((item) => item.msg)],
    });
  }
  return createCustomer(req, res);
});

customersRoutes.get("/best-route", getBestRoute);

export default customersRoutes;
