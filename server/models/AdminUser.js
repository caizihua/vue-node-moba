const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: String },
  password: { type: String },
});
module.exports = mongoose.model("AdminUser", schema);
