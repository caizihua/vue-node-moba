const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String,
    //select表示不将其显示，那么对密码的加密也就只进行了一次，当再次进去时加密的字符串还是没有改变
    select: true,
    //对密码进行更改再保存
    set(val) {
      return require("bcrypt").hashSync(val, 10);
    },
  },
});
module.exports = mongoose.model("AdminUser", schema);