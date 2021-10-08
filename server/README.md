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

- 更改接口，这里就通过`rest/:resource`动态地接受接口数据，这里的resource就是前端请求的某个接口，通过这个接口，找到相应的schema，返回给前端相应的数据。

- 当要为某个schema进行操作时，这里应该使用的就是Model，而这个Model是通过父级参数中得到的模型。

> 注意：
>
> - app.use接受的第二个参数可以是个函数，这个函数充当中间件的作用，对前面的接口进行处理，当处理完后通过next()，执行后面的事宜，router。
>- 定义router时接口一个参数mergeParams，**导入父级参数到子级配置中**。这个参数就是可以动态地将接口中的resource参数传给router，这样router中具体的路由就可以使用这些参数。
> - 前端请求的接口resource具体会是小写开头复数形式，比如说categories，而对应的schema是大写单数的形式如Category，所以需要引入模块进行单复数转换，这个模块就是**inflection**。
>- 最后将得到的schema挂载到req中就可以引用了。

```js
app.use("/admin/api/rest/:resource", async (req, res, next) => {
  const modelName = require('inflection').classify(req.params.resource);
  req.Model = require(`../../models/${modelName}`);
  next();
}, router);
```

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

## 英雄管理

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

## 广告管理

广告管理中的schema模型中应该包含广告标题和广告内容，这里的内容使用数组，其中包含图片还有跳转链接。

```js
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String },
  items: [
    {
      image: { type: String },
      url: { type: String },
    },
  ],
});
module.exports = mongoose.model("Ad", schema);
```

## 管理员账号管理（bcrypt）

管理员schema模型中应有用户名和密码。

```js
const schema = new mongoose.Schema({
  username: { type: String },
  password: {
    type: String, 
    select: false,
    set(val) {
      return require("bcrypt").hashSync(val, 10);
    },
  },
});
```

这里保存密码我们需要进行加密，使得管理人员也应该不知道密码，所以存入数据库的密码就是加了密的密文，且不会更改，所以使用`select`不被显示。

- 对某一项数据可以使用set函数，这个函数的作用就是对传入数据进行操作再进行保存。set函数传入的参数就是原本数据库传来的值，最后函数中需要返回一个值。

  > 散列需要模块**bcrypt**，安装：`npm  i bcrypt`，这个模块就是对传入的值进行加密，使用了单项hash算法。

- 模块中有个函数`hashSync`，是一个同步方法，第一个参数接受值，就是需要加密的值，第二个参数就是加密的等级，等级越高，安全性越高但是加密越耗时，反之等级低则安全性低加密快速，一般取**10-12**。

这样操作之后，当前端点击提交按钮时，在服务端就会对密码进行加密。

密码在编辑界面时是不可查询的。这样做是因为当再次进入编辑页面保存时，未检测出密码也就不会再次加密。

## 登录接口

- 在前端，通过点击登录将登录的用户名和密码传到服务器端来。在后端中进行校验用户名或者密码等操作，最后将数据返回给前端。

- 当校验成功后，服务器生成一串秘钥，返回给前端，前端凭借这串秘钥证明自己是哪个用户。

1. `req.body`中就包含了用户名和密码，通过解构赋值解构出来。

2. 根据用户名找用户。判断用户名不存在的情况。

   > 因为之前显式地不能查询密码，在这里之后的操作中需要校验密码，所以还要使用select字段重新强制取出密码。

3. 校验密码，判断密码错误的情况。

   > 明文与密文的比对也是使用bcrypt模块，之前加密是使用hashSync，这里比对就是使用compareSync，第一个参数就是前端传入的密码，第二个参数就是数据库保存的密文。

4. 此时全部都正确，发送token。

   > 需要使用jsonwebtoken这个模块返回token，它有个方法就是sign生成一个签名，第一个参数就是需要加密保存在前端的信息。第二个参数是一个秘钥，通过这个秘钥再使用算法来生成一个token，客户端是可以不需要秘钥就鞥解密它的，但是需要验证（jwt.verify）正确性。
   >
   > `app.get`当只有一个参数时，就是获取秘密字段。

```js
  app.post("/admin/api/login", async (req, res) => {
    const { username, password } = req.body; 
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
      app.get("secret")
    );
    res.send({ token });
  });
```

设置token生成时使用的秘钥。这里需要在server下的index.js中全局设置。

`app.set`设置秘密字段，第一个参数就是名称`secret`，第二个参数就是字段具体内容。

```js
var fs = require("fs");
// 全局中配置秘密字段
fs.readFile(__dirname + "/a.txt", function (err, data) {
  if (err) {
    return err;
  } else {
    app.set("secret", data.toString());
  }
});
```

### 服务器登录校验（jwt）

> **为什么需要token？**
>
> 前端本地保留的token是为了进行登录校验。
>
> 当没有进行token验证时，前端不能访问管理页面的数据。
>
> 只有进行了token验证，才表示是登录成功的管理员，才有权管理数据。

使用到中间件进行token验证，当进行资源请求时，就进行token的验证。当token不匹配时不能让前端进行访问。

1. 服务器端接收到前端传来的授权信息`Authorization`。分割开取得后面部分的token密文。

   > 后端里的授权信息是小写，前端里的是大写。

2. 使用`verify`方法验证token正确性，第一个参数就是前端传来的token，第二个就是secret字段。

   > jsonwebtoken中有decode方法表示解开token，但是不会验证对错,verify解析token提取出id。

3. 解析正确时会包含着用户的信息，这里之前设置的加密的就是**id**，所以取出id。

4. 根据id查找到相应的user，添加到req中，以便之后使用。相应的用户展示相应的数据。

```js
  const authMiddleware = async (req, res, next) => {  
    const token = String(req.headers.authorization || "")
      .split(" ")
      .pop(); 
    assert(token, 401, "请先登录"); 
    const { id } = jwt.verify(token, app.get("secret"));
    assert(id, 401, "请先登录");
    req.user = await AdminUser.findById(id);
    assert(req.user, 401, "请先登录");
    next();
  };
```

### 服务器登录校验（assert）

`http-assert`是一个npm包，主要用于处理错误，能更简洁方便快速地处理错误。

>**assert(token, 401, "请先登录");** 
>
>第一个参数就是条件，需要满足这个条件。
>
>第二个参数就是状态码，当不满足这个条件时返回的状态码。
>
>第三个参数就是返回错误时的message。

### 服务器登录校验（中间件）

将之前定义的`authMiddleware`验证方法放至请求资源函数中去，使其成为一个中间件。

这是请求资源的接口，这里使用了两个中间件。

- 第一个中间件是验证前端传来的token。
- 第二个接口是对模型名进行单复数大小写变化，在req中挂载数据库Model，这样根据前端的接口，就能直接对相应的model进行访问。
- 最后挂载路由。

```js
  app.use(
    "/admin/api/rest/:resource",
    authMiddleware(),
    resourceMiddleware(),
    router
  );
```

这里的中间件又可以重新封装在不同文件中。

```shell
middleware
│  auth.js
│  resource.js
```

这里导出的使用方法与db.js中app的使用方法一致，导出的是一个函数，如果要使用它，就需要加上**()**。

```js
//auth.js
module.exports = (options) => async (req, res, next) => { 
  //...
};
```



