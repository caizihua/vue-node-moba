//只要是连接数据库操作
module.exports = (app) => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://127.0.0.1:27017/vue-node-moba", {
    useNewUrlParser: true,
  });

  //引用所有模型
  require("require-all")(__dirname + "/../models");
};
