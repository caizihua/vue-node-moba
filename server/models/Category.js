//创建mongo模型文件，主要是创建模型相关凑在哦
//封装好后哪里需要这个模型就在哪里引用
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  //现在数据库中只包含了名字
  name: { type: String },
});
//生成并导出模型
module.exports = mongoose.model("Category", schema);
