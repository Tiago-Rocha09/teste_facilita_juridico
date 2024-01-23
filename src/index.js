import express from "express";
import "dotenv/config";
import customersRoutes from "./routes/customer.js";

const app = express();
app.use(express.json());

app.use("/customers", customersRoutes);

app.get("/", (req, res) => {
  res.send("API teste Facilita Jurídico!");
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});
