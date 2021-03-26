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

## server

需要安装`express@next`表示下一个版本，`mongoose`数据库，`cors`允许跨域请求。

```bash
npm i express@next mongoose cors --save
```

可以将router等路由文件存储在当前文件夹routes中，这个文件夹专门存储路由相关代码。

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

**admin**这里是导出了一个函数，这个函数接受一个参数app对象。

**主文件**中`require`了admin，因为导出的是函数，所以可以传参，又因为引用了app，所以可以将app作为参数传给admin中的文件。

```js
//server/index.js
require("./routes/admin")(app);
```

