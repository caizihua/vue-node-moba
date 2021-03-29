//关于admin端的路由
module.exports = (app) => {
  const express = require("express");
  const router = express.Router({
    //这个参数表示将动态resource能传递给router，这样router里面的路由就能使用这些参数
    mergeParams: true,
  });

  router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  //编辑分类编辑后更新的接口
  router.put("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  //删除分类名的接口
  router.delete("/:id", async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({
      success: true,
    });
  });
  //分类列表的接口
  router.get("/", async (req, res) => {
    //不应该是写死的parent因为可能有的模型没有parent
    //判断是否为分类模型，如果是的话，添加populate
    const queryOptions = {};
    if (req.Model.modelName === "Category") {
      queryOptions.populate = "parent";
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(10);
    res.send(items);
  });

  //分类详情的接口
  router.get("/:id", async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  //动态的resource接受接口参数
  //插入中间件，当调用接口是先调用函数，出现next()才处理接下来的
  app.use(
    "/admin/api/rest/:resource",
    (req, res, next) => {
      //引入模块处理单复数转换，下划线单词的格式转换等
      //classify转类名
      const modelName = require("inflection").classify(req.params.resource);
      //在req中挂载
      req.Model = require(`../../models/${modelName}`);
      next();
    },
    router
  );
};
