const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

app.use(express.json());


app.use((req, res, next) => {
  console.log(`[${req.method}] - ${req.originalUrl}`);
  next();
});


const orders = [];


const checkOrderId = (req, res, next) => {
  const { id } = req.params;
  const orderIndex = orders.findIndex((order) => order.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  next();
};


app.post("/order", (req, res) => {
  const { order, clientName, price } = req.body;
  const id = uuidv4();
  const newOrder = { id, order, clientName, price, status: "Em preparação" };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});


app.get("/order", (req, res) => {
  res.json(orders);
});


app.get("/order/:id", checkOrderId, (req, res) => {
  const { id } = req.params;
  const order = orders.find((order) => order.id === id);
  res.json(order);
});


app.put("/order/:id", checkOrderId, (req, res) => {
  const { id } = req.params;
  const { order, clientName, price, status } = req.body;
  const orderIndex = orders.findIndex((order) => order.id === id);
  orders[orderIndex] = { id, order, clientName, price, status };
  res.json(orders[orderIndex]);
});


app.delete("/order/:id", checkOrderId, (req, res) => {
  const { id } = req.params;
  const orderIndex = orders.findIndex((order) => order.id === id);
  orders.splice(orderIndex, 1);
  res.sendStatus(204);
});


app.patch("/order/:id", checkOrderId, (req, res) => {
  const { id } = req.params;
  const orderIndex = orders.findIndex((order) => order.id === id);
  orders[orderIndex].status = "Pronto";
  res.json(orders[orderIndex]);
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
