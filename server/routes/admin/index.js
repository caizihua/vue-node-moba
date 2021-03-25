//关于admin端的路由
module.exports = (app) => {
  const express = require("express");
  //定义express的子路由
  //这个子路由里面有我们封装的函数
  //因为需要将子路由挂载出去
  const router = express.Router();
  app.use("/admin/api", router);
};
