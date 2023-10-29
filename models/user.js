var mongoose = require("mongoose");

const User = mongoose.model("User", {
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  updateAt: {
    type: Number,
    default: Date.now,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

module.exports = User;
