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

