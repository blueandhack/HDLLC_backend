import { Router } from "express";

import Product from "../models/product";

const router = Router();

router.post("/", async (req, res) => {
  const {
    name,
    price,
    originalPrice,
    description,
    delivery,
    faq,
    SKU,
    companyName,
  } = req.body;
  const product = new Product({
    name,
    price,
    originalPrice,
    description,
    delivery,
    faq,
    SKU,
    companyName,
  });
  try {
    await product.save();
    return res.status(201).send(product);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  let { pageIndex, pageSize, date } = req.query;

  console.log("pageIndex", pageIndex);
  console.log("pageSize", pageSize);
  console.log("date", date);

  if (pageIndex === undefined) {
    pageIndex = 0;
  }
  if (pageSize === undefined) {
    pageSize = 10;
  }
  if (date === undefined) {
    date = Date.now();
  }

  try {
    const products = await Product.find({
      createdAt: { $lt: date },
    })
      .sort({ createdAt: -1 })
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    const total = await Product.countDocuments({
      createdAt: { $lt: date },
    });

    return res.send({
      data: products,
      total,
    });
  } catch (err) {
    return res.status(500).send();
  }
});

// get product by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    return res.send(product);
  } catch (err) {
    return res.status(500).send();
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    originalPrice,
    description,
    delivery,
    faq,
    SKU,
    companyName,
  } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        name,
        price,
        originalPrice,
        description,
        delivery,
        faq,
        SKU,
        companyName,
      },
      { new: true }
    );
    return res.send(product);
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

module.exports = router;
