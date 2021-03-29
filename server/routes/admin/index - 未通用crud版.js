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
  //编辑分类编辑后更新的接口
  router.put("/categories/:id", async (req, res) => {
    const model = await Category.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  //删除分类名的接口
  router.delete("/categories/:id", async (req, res) => {
    await Category.findByIdAndDelete(req.params.id, req.body);
    res.send({
      success: true,
    });
  });
  //分类列表的接口
  router.get("/categories", async (req, res) => {
    //populate表示关联取出什么东西，如果传入的字段是关联字段就能查出来
    //关联查询出来的就是一个包含完整信息的对象
    const items = await Category.find().populate("parent").limit(10);
    //将查找到的数据传给items发给前端
    res.send(items);
  });

  //分类详情的接口
  router.get("/categories/:id", async (req, res) => {
    const model = await Category.findById(req.params.id);
    //将查找到的数据传给items发给前端
    res.send(model);
  });
  app.use("/admin/api", router);
};
