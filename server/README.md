# server服务端

目录结构如下：

```js
server
│  index.js
│  package-lock.json
│  package.json
├─models
│      Category.js
│      Item.js
├─plugins
│      db.js
└─routes
    └─admin
            index.js
```

需要安装`express@next`表示下一个版本，`mongoose`数据库，`cors`允许跨域请求。

```bash
npm i express@next mongoose cors --save
```

## 主要内容 

### 主目录下index.js

主要是注册使用全局使用的模块等，例如express，cors等。

并启动服务器。

```js
//服务端代码
const express = require("express");

const app = express();
//使用JSON
app.use(express.json());
//直接使用跨域模块
app.use(require("cors")());

require("./routes/admin")(app);
require("./plugins/db")(app);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

### routes目录

可以将router等路由文件存储在当前文件夹routes中，这个文件夹专门存储路由相关代码。

- admin目录存储`管理端`相关的路由代码：

  ```js
  //router/admin/index.js
  //关于admin端的路由
  module.exports = (app) => {
    const express = require("express");
    //定义express的子路由
    //这个子路由里面有我们封装的函数
    //因为需要将子路由挂载出去
    const router = express.Router();
    app.use("/admin/api", router);
  };
  ```

**admin**这里是导出了一个`函数`，这个函数接受一个参数app对象。

**主文件index.js**中`require`了admin，因为导出的是函数，所以可以传参，又因为引用了app，所以可以将app作为参数传给admin中的文件。

```js
//server/index.js
require("./routes/admin")(app);
```

### plugins目录

💦新建`plugins`文件夹存放数据库代码，新建db.js，作为连接数据库等操作的文件。

```js
module.exports = (app) => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://127.0.0.1:27017/vue-node-moba", {
    useNewUrlParser: true,
  });
};
```

### models目录

💦创建模型文件夹`models`,里面封装的就是数据库等的模型文件。

创建`Category.js`作为分类的数据库模型文件。

```js
//创建mongo模型文件
//封装好后哪里需要这个模型就在哪里引用
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String },
});
module.exports = mongoose.model("Category", schema);
```

## 通用CRUD

最开始时，只有分类的各种增删查改，随着需求的增加，会有其他数据的增删查改，比如说物品，新闻资讯等，所以需要一套通用的crud接口来对所有数据进行增删查改，对于某些特殊的数据再进行特殊地处理。

```js
module.exports = (app) => {
  const express = require("express");
  const router = express.Router({
    //这个参数表示将动态resource能传递给router，这样router里面的路由就能使用这些参数
    mergeParams: true,
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
  const multer = require("multer");
  app.use("/admin/api/upload", async (req, res) => {});
};
```

更改接口，这里就通过`rest/:resource`动态地接受接口数据，这里的resource就是前端请求的某个接口，通过这个接口，找到相应的schema，返回给前端相应的数据。

> 注意：
>
> - app.use接受的第二个参数可以是个函数，这个函数充当中间件的作用，对前面的接口进行处理，当处理完后通过next()，执行后面的事宜，router。
>
> - 定义router时接口一个参数mergeParams，这个参数就是可以动态地将接口中的resource参数传给router，这样router中具体的路由就可以使用这些参数。
>
> - 前端请求的接口resource具体会是小写开口复数形式，比如说categories，而对应的schema是大写单数的形式如Category，所以需要引入模块进行单复数转换，这个模块就是inflection。
> - 最后将得到的schema挂载到req中就可以引用了。

对于分类列表中父级分类的操作，在通用crud中就不能写死，因为有的模型不适用于Category模型定义的父级分类这种特殊分类。所以需要特殊处理。

判断如果前端传来的模型是Category时，就添加populate属性。

populate表示关联取出什么东西，如果传入的字段是关联字段就能查出来，关联查询出来的就是一个包含完整信息的对象。这个关联的是parent，所以就会将父级的所有信息作为一个对象取出返回给前端。

```js
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
```

## 图片上传

- 如果需要图片上传，可以使用multer模块，这个模块是用于处理`form-data`或者`multipart`

  multer会添加file对象到req中，req中包含表单上传的文件信息。

  表单中可以设置dest属性，表示存储在哪里。

  `single`接受单个文件的上传名字为file，因为接口formData中的名字就是file。

- 将file对象取出，设置访问路径`file.url`。

  file对象中有filename就是图片的二进制名称。

  将file再发出。

```js
//关于admin端的路由
module.exports = (app) => {
  const multer = require("multer");
  const upload = multer({ dest: __dirname + "/../../uploads" });
  app.post("/admin/api/upload", upload.single("file"), async (req, res) => {
    const file = req.file;
    //添加访问路径，具体的就是file里面的filename，是二进制数据
    file.url = `http://localhost:3000/uploads/${file.filename}`;
    res.send(file);
  });
};
```

## 英雄编辑

英雄的类型应该是可选的，而不是输入的，并且保存的也应该是类型的`_id`。

而且这个分类，某些英雄职业可能不止一个，所以还需要多选。可以使用数组来保存多个值。

```js
//server/models/Hero.js
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  title: { type: String },
  // 这里的关联模型就是Category，因为需要在分类模型中选择职业的类型
  //这里使用数组表示可以关联多个
  category: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Category" }],
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
module.exports = mongoose.model("Hero", schema);
```

### 编辑英雄技能

### 英雄技能删除

## 创建文章和编辑文章

### 富文本编辑器`vue2-editor`

### 富文本中图片上传

## 广告管理

## 管理员账号管理（bcrypt）

## 登录页面

## 登录接口

## 服务器登录校验（jwt）

## 服务器登录校验（assert）