var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", function (req, res, next) {
  console.log(req.body);

  const { username, password } = req.body;

  console.log(username, password);

  // check username and password
  if (username !== "admin" || password !== "admin") {
    res.status(401).json({ message: "unauthorized" });
  }

  // using jwt create token
  const token = jwt.sign({ username }, "abc", {
    expiresIn: "30days",
  });

  // send token to client
  res.json({ message: "success", token: token });
});

router.get("/currentUser", function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);

  // verify token
  jwt.verify(token, "abc", function (err, decoded) {
    if (err) {
      res.status(401).json({ message: "unauthorized" });
    }

    res.json({ message: "success", username: decoded.username });
  });
});

module.exports = router;
