module.exports = (options) => {
  const jwt = require("jsonwebtoken");
  var assert = require("http-assert");
  const AdminUser = require("../models/AdminUser.js");
  return async (req, res, next) => {
    //服务器登录验证
    //后端中的请求头中的请求都是小写，前端中是大写
    const token = String(req.headers.authorization || "")
      .split(" ")
      .pop();
    //考虑校验码为空时报错
    assert(token, 401, "请先登录");
    //jsonwebtoken中有decode方法表示解开token，但是不会验证对错,verify解析token提取出id
    const { id } = jwt.verify(token, req.app.get("secret"));
    assert(id, 401, "请先登录");
    req.user = await AdminUser.findById(id);
    assert(req.user, 401, "请先登录");
    await next();
  };
};

//这里options的使用方法与db.js中app的使用方法一致，导出的是一个函数，如果要使用它，就需要加上()
