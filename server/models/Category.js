//创建mongo模型文件，主要是创建模型相关凑在哦
//封装好后哪里需要这个模型就在哪里引用
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  //现在数据库中只包含了名字
  name: { type: String },
  //存入的不是String类型，而是mongodb的objectId类型
  //ref关联的模型就是Category
  //通过关联模型parent就能通过这个模型找到这个模型当中某个数据的ObjectId
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
});

schema.virtual("children", {
  localField: "_id",
  foreignField: "parent",
  justOne: false,
  ref: "Category",
});

schema.virtual("newsList", {
  localField: "_id",
  foreignField: "categories",
  justOne: false,
  ref: "Article",
});
//生成并导出模型
module.exports = mongoose.model("Category", schema);
