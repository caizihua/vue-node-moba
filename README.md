# vue-node-element

> 一个Vue-Node-Element的练手项目

主要的三个文件夹分别是web，serve，admin

👋serve为服务端界面🤚admin为管理端界面🖐web为主页相关界面

```bash
vue create serve
vue create admin
//安装npm依赖
npm init -y
//在package.js中添加脚本
{
    "scripts": {
    "serve":"nodemon index.js"
  },
}
```

## 基础界面

使用`element-ui`画界面，在文件夹下安装：

```bash
//添加element-ui
vue add element
//添加router路由
vue add router
```

在element-ui官网的全局组件中复制组件代码到这个项目。

在`views`目录下添加`Main.vue`文件存放组件代码。

```vue
<template>
  <el-container style="height: 500px; border: 1px solid #eee">
   ...
  </el-container>
</template>
//这里的style中的height修改为100vh，表示的是屏幕的高度
```

在`router`路由目录下的`index.js`中导入组件并使用。

```js
import Main from "../views/Main.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  }, 
];
```

### element-ui

```vue
    <el-form label-width="80px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit">提交</el-button>
      </el-form-item>
    </el-form>
```

`@submit.native.prevent`表示使用原生的提交事件并且阻止页面跳转，save是一个方法。

`native-type`表示使用原生属性。

## axios

使用save方法保存数据还有接口请求就需要`axios`。

```bash
npm i axios
```

新建`http.js`处理接口请求。

```js
import axios from "axios";
const http = axios.create({
  baseURL: "http://localhost:3000/admin/api",
});
export default http;
```

在main.js中Vue全局实例原型中定义`$http`使可以全局使用。

```js
import http from "./http"; 
Vue.prototype.$http = http;
```

## server服务端

目录结构如下：

```js
server
│  index.js
│  package-lock.json
│  package.json
├─models
│      Category.js
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

##  添加分类名

CategoryEdit.vue文件是添加分类页面，输入分类名称添加到数据库中。

```vue
<script>
export default {
  data() {
    return {
      model: {},
    };
  },
  methods: {
    async save() {
      //async await将类似同步的写法写成异步
      const res = await this.$http.post("categories", this.model);
      console.log(res);
      //跳转到分类页面
      this.$router.push("/categories/list");
      //提示保存成功
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
  },
};
</script>
```

这里的post请求是在server端实现的。将输入的信息传递到服务端。

```js
//server/routes/admin/index.js
//关于admin端的路由
module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const Category = require("../../models/Category");
  //创建分类的接口
  router.post("/categories", async (req, res) => {
    const model = await Category.create(req.body);
    res.send(model);
  });
  app.use("/admin/api", router);
};
```

`req.body`得到网页post过来的信息，并进行处理，`Category`是得到模型。将得到的信息加入数据库，并发送回前端。前端接收到后提示发送成功。

## 分类名显示

CategoryList.vue是显示分类名称的列表页面，可以查看有什么分类。

`:data`是表单要显示的数据，`prop`是表单中的属性名。

通过get得到数据库中有哪些分类名称，取得res对象。

将对象中的data数据传给items进行渲染。

```vue
<template>
  <div>
    <h1>分类列表</h1>
    <!--:data提供数据 -->
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="300"> </el-table-column>
      <el-table-column prop="name" label="分类名称"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  methods: {
    async fetch() {
      //使用get方法获取服务端的接口
      const res = await this.$http.get("categories");
      this.items = res.data;
    },
  },
  created() {
    this.fetch();
  },
};
</script>
```

server端进行数据库中数据的检索并传给前端。

```js
//server/routes/admin/index.js
//关于admin端的路由
module.exports = (app) => {
  const express = require("express"); 
  const router = express.Router(); 

  const Category = require("../../models/Category");

  //分类列表的接口
  router.get("/categories", async (req, res) => {
    const items = await Category.find().limit(10);
    //将查找到的数据传给items发给前端
    res.send(items);
  });
  app.use("/admin/api", router);
};

```

通过`/admin/api`端口，进行各种网络请求。相当于api接口。