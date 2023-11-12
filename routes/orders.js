import { Router } from "express";
const router = Router();
var jwt = require("jsonwebtoken");

import Order from "../models/order";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const calculateOrderAmount = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total * 100;
};

router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  const token = req.headers.authorization.split(" ")[1];

  let decoded;
  // verify token
  try {
    decoded = jwt.verify(token, "abc");
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "unauthorized" });
  }

  const { _id: userId } = decoded;
  console.log("userId", userId);

  const parseItems = items.map((item) => {
    return {
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      originalPrice: item.originalPrice,
    };
  });

  // create order
  const order = new Order({
    items: parseItems,
    status: "pending",
    userId,
  });

  const newOrder = await order.save();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    description: `OrderId: ${newOrder._id.toString()}`,
    metadata: {
      orderId: newOrder._id.toString(),
    },
  });

  // console.log("paymentIntent", paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = router;
