var express = require("express");
var router = express.Router();

var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async function (req, res, next) {
  const { email, password } = req.body;

  console.log(email, password);

  const user = new User({ email, password });

  const newUser = await user.save();

  res.json(newUser);
});

module.exports = router;
