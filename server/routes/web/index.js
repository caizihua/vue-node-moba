/* JSON.stringify(
  $$(".hero-nav > li")
    .map((li, i) => {
      return {
        name: li.innerText,
        heroes: $$("li", $$(".hero-list")[i]).map((el) => {
          return {
            name: $$("h3", el)[0].innerHTML,
            avatar: $$("img", el)[0].src,
          };
        }),
      };
    })
); */
//为了快速渲染文章列表数据，这里通过接口实现，应用中不应有这个接口，这里这是为了作测试处理
module.exports = (app) => {
  const router = require("express").Router();
  const mongoose = require("mongoose");
  const Category = mongoose.model("Category");
  const Article = mongoose.model("Article");
  const Hero = mongoose.model("Hero");
  //导入新闻数据
  router.get("/news/init", async (req, res) => {
    const parent = await Category.findOne({
      name: "新闻分类",
    });
    const cats = await Category.find().where({ parent: parent }).lean();
    const newsTitles = [
      "全国大赛城市赛道海选—“荣耀邮你全民挑战赛”火热来袭！",
      "貂蝉-仲夏夜之梦技能特效优化进度展示",
      "全国大赛全国行｜多城省赛齐开赛，“全运会”征程战鼓擂！",
      "报名开启！全民全运·王者荣耀赛事暨全国大赛城市赛道海选赛即将开赛",
      "青铜冲王者，主播零阵亡挑战赛",
      "4月8日“长安密探”版本异常说明",
      "4月8日正式服版本更新公告",
      "4月7日体验服停机更新公告",
      "4月6日体验服停机更新公告",
      "4月6日抢先服王者时刻维护公告",
      "S23赛季开启，新版本多重福利等你领取",
      "【助威拿“新十代勋章”】活动公告",
      "【微信用户专属】微信小程序“游戏礼品站”购买“李元芳-飞鸢探春”皮肤抽免单活动",
      "春满峡谷四月天，当趁东风放纸鸢",
      "一春花繁近清明，峡谷福利享不停",
      "全国大赛城市赛道海选—“荣耀邮你全民挑战赛”火热来袭！",
      "全国大赛全国行｜多城省赛齐开赛，“全运会”征程战鼓擂！",
      "报名开启！全民全运·王者荣耀赛事暨全国大赛城市赛道海选赛即将开赛",
      "惊闻张三怒敲登闻鼓，包青天断案峡谷纠纷？国潮古都开封邀你助阵全国大赛",
      "国潮古都邀你为省助阵！第三届全国大赛城市赛道第一期省赛开启",
    ];
    const newsList = newsTitles.map((title) => {
      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5);
      return {
        categories: randomCats.slice(0, 2),
        title: title,
      };
    });
    // await Article.deleteMany({});
    // await Article.insertMany(newsList);
    res.send(newsList);
  });
  //新闻列表接口 测试用
  router.get("/news/list", async (req, res) => {
    /* const parent = await Category.findOne({ name: "新闻分类" })
      .populate({
        path: "children",
        populate: {
          path: "newsList",
          populate: "newsList",
        },
      })
    .lean();*/
    const parent = await Category.findOne({ name: "新闻分类" });
    const cats = await Category.aggregate([
      //通过match过滤数据
      { $match: { parent: parent._id } },
      //关联查询
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "categories",
          as: "newsList",
        },
      },
      //修改newsList
      {
        $addFields: {
          newsList: {
            $slice: ["$newsList", 5],
          },
        },
      },
    ]);
    const subCats = cats.map((v) => v._id);
    cats.unshift({
      name: "热门",
      newsList: await Article.find()
        .where({ categories: { $in: subCats } })
        .limit(5)
        .lean()
        .populate("categories"),
    });

    cats.map((cat) => {
      cat.newsList.map((news) => {
        news.categoryName =
          cat.name === "热门" ? news.categories[0].name : cat.name;
        return news;
      });
      return cat;
    });
    res.send(cats);
  });
  //导入英雄数据 测试用
  const hero1 = require("./hero.js");
  router.get("/heroes/init", async (req, res) => {
    // await Hero.deleteMany({});
    const rawData = hero1;
    for (let cat of rawData) {
      if (cat.name === "热门") {
        continue;
      }
      const category = await Category.findOne({ name: cat.name });
      cat.heroes = cat.heroes.map((hero) => {
        hero.categories = [category];
        return hero;
      });
      // await Hero.insertMany(cat.heroes);
    }

    res.send(await Hero.find());
  });
  //英雄列表接口
  router.get("/heroes/list", async (req, res) => {
    const parent = await Category.findOne({ name: "英雄分类" });
    const cats = await Category.aggregate([
      //通过match过滤数据
      { $match: { parent: parent._id } },
      //关联查询
      {
        $lookup: {
          from: "heroes",
          localField: "_id",
          foreignField: "categories",
          as: "heroList",
        },
      },
    ]);
    const subCats = cats.map((v) => v._id);
    cats.unshift({
      name: "热门",
      heroList: await Hero.find()
        .where({ categories: { $in: subCats } })
        .limit(10)
        .lean(),
    });

    res.send(cats);
  });
  //文章详情
  router.get("/articles/:id", async (req, res) => {
    const data = await Article.findById(req.params.id).lean();
    data.related = await Article.find()
      .where({
        categories: { $in: data.categories },
        categories: { $ne: data.categories },
      })
      .limit(2);
    res.send(data);
  });
  router.get("/heroes/:id", async (req, res) => {
    const data = await Hero.findById(req.params.id)
      .lean()
      .populate("categories items1 items2 partners.hero");
    res.send(data);
  });
  app.use("/web/api", router);
};
