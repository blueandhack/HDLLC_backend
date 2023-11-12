import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Order = mongoose.model("Order", {
  userId: ObjectId,
  items: [
    {
      productId: ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      originalPrice: Number,
    },
  ],
  status: String,
  updatedAt: {
    type: Number,
    default: Date.now,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

module.exports = Order;
