module.exports = () => async (req, res, next) => {
  //引入模块处理单复数转换，下划线单词的格式转换等
  //classify转类名
  const modelName = require("inflection").classify(req.params.resource);
  //在req中挂载
  req.Model = require(`../models/${modelName}`);
  await next();
};
