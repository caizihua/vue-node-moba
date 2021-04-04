//关于admin端的路由
module.exports = (app) => {
  const express = require("express");
  const jwt = require("jsonwebtoken");
  var assert = require("http-assert");
  const AdminUser = require("../../models/AdminUser");
  const router = express.Router({
    //这个参数表示将动态resource能传递给router，这样router里面的路由就能使用这些参数
    // mergeParams: true,
  });

  router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  //1编辑分类编辑后更新的接口
  router.put("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  //2删除分类名的接口
  router.delete("/:id", async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({
      success: true,
    });
  });
  //3分类列表的接口
  router.get("/", async (req, res) => {
    //不应该是写死的parent因为可能有的模型没有parent,判断是否为分类模型，如果是的话，添加populate
    const queryOptions = {};
    if (req.Model.modelName === "Category") {
      queryOptions.populate = "parent";
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(10);
    res.send(items);
  });

  //4分类详情的接口
  router.get("/:id", async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  //5将验证模块抽离
  const authMiddleware = async (req, res, next) => {
    //服务器登录验证
    //后端中的请求头中的请求都是小写，前端中是大写
    const token = String(req.headers.authorization || "")
      .split(" ")
      .pop();
    //考虑校验码为空时报错
    assert(token, 401, "请先登录");
    //jsonwebtoken中有decode方法表示解开token，但是不会验证对错,verify解析token提取出id
    const { id } = jwt.verify(token, app.get("secret"));
    assert(id, 401, "请先登录");
    req.user = await AdminUser.findById(id);
    assert(req.user, 401, "请先登录");
    next();
  };
  //6动态的resource接受接口参数,插入中间件，当调用接口是先调用函数，出现next()才处理接下来的
  app.use(
    "/admin/api/rest/:resource",
    authMiddleware,
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
  //7上传文件代码
  //multer用于处理form-data或者multipart,会添加file对象到req中包含表单上传的文件信息
  //dest属性表示在哪里存储文件,接受单个文件的上传名字为file，因为接口formData中的名字就是file
  const multer = require("multer");
  const upload = multer({ dest: __dirname + "/../../uploads" });
  app.post("/admin/api/upload", upload.single("file"), async (req, res) => {
    const file = req.file;
    //添加访问路径，具体的就是file里面的filename，是二进制数据
    file.url = `http://localhost:3000/uploads/${file.filename}`;
    res.send(file);
  });
  //8token
  app.post("/admin/api/login", async (req, res) => {
    const { username, password } = req.body;
    //根据用户名找用户,将password强制取出
    const user = await AdminUser.findOne({ username }).select("+password");
    assert(username !== "", 422, "请输入用户名");
    assert(user, 422, "用户不存在");
    //校验密码,将明文和密文进行比对
    const isValid = require("bcrypt").compareSync(password, user.password);
    assert(isValid, 422, "密码错误");
    //返回token
    const token = jwt.sign(
      {
        id: user._id,
      },
      //只能得到一个参数，获取配置
      app.get("secret")
    );
    res.send({ token });
  });
  //错误处理
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message,
    });
  });
};
