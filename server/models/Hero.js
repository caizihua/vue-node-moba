const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  banner: { type: String },
  title: { type: String },
  // 这里的关联模型就是Category，因为需要在分类模型中选择职业的类型
  //这里使用数组表示可以关联多个
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Category" }],
  //定义了复合类型，更像是对象的属性
  //评分
  scores: {
    difficult: { type: Number },
    skills: { type: Number },
    attack: { type: Number },
    survive: { type: Number },
  },
  //技能
  skills: [
    {
      icon: { type: String },
      name: { type: String },
      delay: { type: String },
      cost: { type: String },
      description: { type: String },
      tips: { type: String },
    },
  ],
  //顺风逆风出装
  items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Item" }],
  items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Item" }],
  //使用技巧
  usageTips: { type: String },
  //对战技巧
  battleTips: { type: String },
  //团队技巧
  teamTips: { type: String },
  //英雄关系 搭档
  partners: [
    {
      hero: { type: mongoose.SchemaTypes.ObjectId, ref: "Hero" },
      description: { type: String },
    },
  ],
});
module.exports = mongoose.model("Hero", schema, "heroes");
