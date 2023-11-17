var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const User = require("../models/user");
const Order = require("../models/order");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_...";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", async function (req, res, next) {
  console.log(req.body);

  const { email, password } = req.body;

  console.log(email, password);

  // check username and password

  const user = await User.findOne({ email, password });

  console.log(user);

  if (!user) {
    return res.status(401).json({ message: "unauthorized" });
  }

  // using jwt create token
  const token = jwt.sign({ _id: user._id, email }, "abc", {
    expiresIn: "30days",
  });

  // send token to client
  return res.json({ message: "success", token: token });
});

router.get("/currentUser", function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);

  // verify token
  jwt.verify(token, "abc", function (err, decoded) {
    if (err) {
      console.error(err);
      res.status(401).json({ message: "unauthorized" });
    }

    res.json({ message: "success", username: decoded.username });
  });
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        endpointSecret
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        // Then define and call a function to handle the event charge.succeeded
        const orderId = chargeSucceeded.metadata.orderId;

        // Update order status to paid
        const order = await Order.findOneAndUpdate(
          { _id: orderId },
          {
            status: "paid",
          },
          { new: true }
        );

        console.log(order);

        // send email to user

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
module.exports = router;
