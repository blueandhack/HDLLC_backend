var express = require("express");
var router = express.Router();

var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async function (req, res, next) {
  const { email, password, firstName, lastName } = req.body;

  const user = new User({ email, password, firstName, lastName });

  try {
    const newUser = await user.save();
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
