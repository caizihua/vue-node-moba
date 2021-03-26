//关于admin端的路由
module.exports = (app) => {
  const express = require("express");
  //定义express的子路由
  //这个子路由里面有我们封装的函数
  //因为需要将子路由挂载出去
  const router = express.Router();
  //引入数据库schema，可以进行表的创建等操作

  const Category = require("../../models/Category");

  //创建分类的接口
  router.post("/categories", async (req, res) => {
    const model = await Category.create(req.body);
    res.send(model);
  });

  //分类列表的接口
  router.get("/categories", async (req, res) => {
    const items = await Category.find().limit(10);
    //将查找到的数据传给items发给前端
    res.send(items);
  });
  app.use("/admin/api", router);
};
