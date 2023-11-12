var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const User = require("../models/user");

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

module.exports = router;
