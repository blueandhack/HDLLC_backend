const mongoose = require("mongoose");

const MONGODB_URL = "mongodb://localhost:27017/database";

module.exports = {
  connectDatabase: () => {
    return mongoose.connect(MONGODB_URL, {});
  },
};
