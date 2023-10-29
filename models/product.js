import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Product = mongoose.model("Product", {
  name: {
    type: String,
    required: true,
  },
  price: Number,
  originalPrice: Number,
  description: String,
  pictureIds: {
    type: [ObjectId],
    default: [],
  },
  categoryId: {
    type: ObjectId,
    default: null,
  },
  delivery: String,
  deliveryAreaId: ObjectId,
  commentIds: {
    type: [ObjectId],
    default: [],
  },
  faq: String,
  companyName: String,
  updatedAt: {
    type: Number,
    default: Date.now,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

module.exports = Product;
