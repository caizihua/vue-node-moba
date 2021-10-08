# admin端

##  分类管理

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

### 分类名显示

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

### 上级分类显示

上级分类简单实现就是通过直接访问已有分类，在已有分类基础上添加子分类，所以添加`el-select`标签进行上级分类的选择。

```vue
<el-form-item label="上级分类">
        <!-- model中存入或取出parent -->
        <el-select v-model="model.parent">
          <!-- 展示的是名称，真正存的value是id -->
          <el-option
            v-for="item in parents"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
</el-form-item>
```

在data中需要定义存放父类的数组。`fetchParents`方法直接获取已有分类并且赋值给parents展示。

```javascript
data() {
    return {
      model: {
        name: "",
      },
      //获取分类名的数组，作为上级分类的可选项
      parents: [],
    };
  },
methods: {  
    //获取父级选项分类名称，接口就是categories
    async fetchParents() {
      const res = await this.$http.get(`categories`);
      this.parents = res.data;
    },
  },
  created() { 
    //获取父级分类名
    this.fetchParents();
  },
```

### 新建与编辑操作整合

通过组件复用，可以通过CtategoryEdit组件进行新建分类操作和编辑分类操作。

不同的地址使用相同的组件，id表示数据的标识，props为true表示将数据传入组件中。

```js
const routes = [
  {
    path: "/",
    component: Main,
    children: [
      {
        path: "/categories/create",
        component: CategoryEdit,
      },
      {
        path: "/categories/edit/:id",
        component: CategoryEdit,
        props: true,
      }, 
    ],
  },
];

```

在CategoryEdit.vue中通过是否传入id可以选择显示编辑还是新建分类。

```html
<h1>{{ id ? "编辑" : "新建" }}分类</h1>
```

```js
export default {
  //这样就能直接使用id，不用再写复杂的参数
  props: {
    id: {},
  },
  data() {
    return {
      model: {},
    };
  },
  methods: {
    async save() {
      //对于新建和编辑，保存的方法不一样，一个是post，一个是put
      //async await将类似同步的写法写成异步
      let res;
      if (this.id) {
        res = await this.$http.put(`categories/${this.id}`, this.model);
      } else {
        res = await this.$http.post("categories", this.model);
      }

      console.log(res);
      //跳转到分类页面
      this.$router.push("/categories/list");
      //提示保存成功
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    //获取分类的详情
    async fetch() {
      const res = await this.$http.get(`categories/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    //前面的条件满足才执行后面的函数
    this.id && this.fetch();
  },
};
```

### 分类删除

**CategoryList.vue**

在编辑按钮旁添加删除按钮，可以删除某分类。

其中remove函数汇总传入参数`scope.row`表示将点击的这行数据传给函数。

```vue
<el-button type="primary" size="small" @click="remove(scope.row)">删除</el-button>
```

编译remove函数逻辑。

```js
export default { 
  methods: { 
    remove(row) {
      this.$confirm(`是否确定删除分类："${row.name}"？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/categories/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.fetch();
      });
    },
  }, 
};
```

### 图片上传

`el-upload`是elementUI自带的上传组件，接受的参数：

- `:action`动态地接受地址，上传数据到该接口。接受的是完整路径，这里的`$http.defaults.baseURL`是axios之前配置的baseURL，存放在http.defaults中，再加上指定的端口
- `on-success`表示成功后调用的函数，函数中返回的参数中找到地址赋给model.icon展示出图标。
- `:src="model.icon"`如果有图片地址就显示图片，`v-if="model.icon"`没有就显示上传图标。

```vue
<el-form-item label="图标">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
```

1. `this.model.icon = res.url;`

   后端传来的对象res中包括了展示图片的地址。

   这里应注意，如果data的model里面没有`定义`icon，这样赋值将不会有效果。

   因为可能是响应式问题，没有定义icon就对icon赋值是没有意义的，当然也不会显示的。

   可以显式地使用$set为对象添加不存在的属性。

   或者可以在data数据里面定义icon。

2. `this.$set(this.model, "icon", res.url);`

   使用$set时也应注意，如果对象已经添加了icon属性，这样添加也不会响应，应该是添加没有的属性。

```js
export default {
  props: {
    id: {},
  },
  data() {
    return {
      model: {
        name: "",
        //icon:"",
      },
    };
  },
  methods: {
    afterUpload(res) {
      this.$set(this.model, "icon", res.url);
    },
  },
  created() {
    this.id && this.fetch();
  },
};
```

## 英雄管理

### 添加类型，难度，顺风逆风出装

- 类型

  英雄页面中，类型应该是可多选的，不止有一个职业。

  > multiple表示可以多选，这是elementUI中的定义的。

  ```vue
  <el-form-item label="类型">
    <!-- 添加multiple字段就能进行多选 -->
    <el-select v-model="model.categories" multiple>
      <el-option
        v-for="item of categories"
        :key="item.id"
        :value="item._id"
        :label="item.name"
      ></el-option>
    </el-select>
  </el-form-item>
  ```

- 难度

  难度可以使用elementUI中的el-rate展示。

  ```vue
  <el-form-item label="难度">
    <el-rate
      v-model="model.scores.difficult"
      :max="9"
      show-score
      style="margin-top: 0.7rem"
    ></el-rate>
  </el-form-item>
  <el-form-item label="技能">
    <el-rate
      v-model="model.scores.skills"
      :max="9"
      show-score
      style="margin-top: 0.7rem"
    ></el-rate>
  </el-form-item>
  <el-form-item label="攻击">
    <el-rate
      v-model="model.scores.attack"
      :max="9"
      show-score
      style="margin-top: 0.7rem"
    ></el-rate>
  </el-form-item>
  <el-form-item label="生存">
    <el-rate
      v-model="model.scores.survive"
      :max="9"
      show-score
      style="margin-top: 0.7rem"
    ></el-rate>
  </el-form-item>
  ```


### 数据处理

出装需要多选，而且数据要从服务器中取出。前面英雄类型也是需要从服务器中取出的。

```js
async fetchCategories() {
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
    async fetchItems() {
      const res = await this.$http.get(`rest/items`);
      this.items = res.data;
    },
```

并且要在创建实例时就要运行。

```js
created() {
    this.fetchItems();
    this.fetchCategories();
},
```

### 编辑英雄技能

el-tabs表示选项卡，默认选中第一个标签页，可以通过 `value` 属性来指定当前选中的标签页。

- 新增技能

  通过按钮来点击，每点击一次新增一项英雄技能可以编辑名称，技能图标等。

  点击时相当于给技能skills数组push了一个没有数据的空对象。

  编辑的每项技能使用的是flex布局。md为12，又添加了`flex-wrap`，所以一行最多容纳两个技能的编辑位置。

- 上传图片

  elementUI有自己的上传图片组件`el-upload`。

  `action`表示提交的地址。`$http.defaults.baseURL + '/upload'`baseURL就是在http.js中自定义的基础路径，后接upload接口。

  成功后将icon展示出来，`(res) => $set(item, 'icon', res.url)`表示给item里面的icon属性赋`res.url`值。这样icon中的就是图片地址。展示的也是图片地址。

- 删除某项技能

  skills是一个数组，其中存放着各种数据，如果想要删除某项技能，就是删除数组某项。

  `model.skills.splice(i, 1)`当点击时使用splice删除这一项。

```vue
<el-tabs value="basic">
  <el-tab-pane label="基础信息" name="basic">
  //...
  </el-tab-pane>
  <el-tab-pane label="技能" name="skills">
    <!-- 添加新技能，给skills push一个新对象 -->
    <el-button @click="model.skills.push({})" style="margin-bottom: 1rem">
      <i class="el-icon-plus"></i>添加技能
    </el-button>
    <el-row type="flex" style="flex-wrap: wrap">
      <el-col :md="12" v-for="(item, i) in model.skills" :key="i">
        <el-form-item label="名称">
          <el-input v-model="item.name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-upload
            class="avatar-uploader"
            :action="$http.defaults.baseURL + '/upload'"
            :show-file-list="false"
            :on-success="(res) => $set(item, 'icon', res.url)"
          >
            <!-- 如果有图片地址就显示图片，没有就显示上传图标 -->
            <img v-if="item.icon" :src="item.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="item.description"></el-input>
        </el-form-item>
        <el-form-item label="小提示">
          <el-input type="textarea" v-model="item.tips"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="danger"
            @click="model.skills.splice(i, 1)"
            >删除</el-button
          >
        </el-form-item>
      </el-col>
    </el-row>
  </el-tab-pane>
</el-tabs>
```

## 文章管理

文章类型应该也是多选的，可以是不同类型的文章。

### 详情编辑

文章详情应该是使用富文本进行编辑的。

在script中应该引用。

```js
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor,
  },
```

`vue-editor`是使用富文本quill，这是需要安装的包`vue2-editor`提供的。`npm install vue2-editor`

```vue
<el-form-item label="详情">
        <vue-editor
          v-model="model.body"
          useCustomImageHandler
          @image-added="handleImageAdded"
        ></vue-editor>
      </el-form-item>
```

### 插入图片

如果在富文本中插入图片，编辑器会将图片转成代码格式直接嵌套在html中，这样会使得请求变得十分大，所以不应使用这种方法。应该是在富文本上传单独的，服务器挂载的图片，并将图片访问出来。

需要在`<vue-editor>`中添加相应的属性。

首先，我们上传图片的方式是使用FormData，里面的file就是我们上传的图片。

这里vue2-editor也是定义的`FormData()`，所以可以接受的是**表单数据**和**JSON数据**。

```js
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      //添加file文件
      formData.append("file", file);
      //使用axios向upload地址发送formData
      const res = await this.$http.post("upload", formData);
      //在光标位置插入图片
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader(); 
    },
```

vue2-editor官网使用的axios方式实现异步，这里我们只需要使用`async await`就能轻松解决。

```js
//axios方式
axios({
        url: "",
        methods: "POST",
        data: formData,
      })
      .then((result) => {
        let url = result.data.url;
        Editor.insertEmbed(cursorLoaction, "image", url);
        reseUploader();
      })
      .catch((err) => {
        console.log(err);
      });
```

## 广告管理

编辑广告界面和添加技能界面类似。

这里上传的图片不一定是正方形，所以需要重新定义，只需要设置`min-width : 5rem;`就能限制最小宽度。

```vue
<el-form-item label="广告">
  <el-button @click="model.items.push({})" style="margin-bottom: 1rem">
    <i class="el-icon-plus"></i>添加广告
  </el-button>
  <el-row type="flex" style="flex-wrap: wrap">
    <el-col :md="16" v-for="(item, i) in model.items" :key="i">
      <el-form-item label="跳转链接(URL)">
        <el-input v-model="item.url"></el-input>
      </el-form-item>
      <el-form-item label="图片" style="margin-top: 0.5rem">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="(res) => $set(item, 'image', res.url)"
        >
          <!-- 如果有图片地址就显示图片，没有就显示上传图标 -->
          <img v-if="item.image" :src="item.image" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="danger"
          @click="model.items.splice(i, 1)"
          >删除</el-button
        >
      </el-form-item>
    </el-col>
  </el-row>
</el-form-item>
```

## 界面总体分类变更

`Main.vue`主路由一级菜单中，包含了三项，内容管理，运营管理，系统管理。

open指的 sub-menu 展开的回调。可以绑定事件。第一个参数index: 打开的 sub-menu 的 index

`default-openeds`当前打开的 sub-menu 的 index 的数组。

```vue
<el-menu
        router
        @open="handleOpen"
        :default-openeds="[hanleOpeneds]"
        unique-opened
        :default-active="$route.path"
      >
  
	<el-submenu index="1"><!--内容管理--></el-submenu>
  <el-submenu index="2"><!--运营管理--></el-submenu>
  <el-submenu index="3"><!--系统管理--></el-submenu>
</el-menu>
<script>
export default {
  data() {
    return {
      hanleOpeneds: "1",
    };
  },
  methods: {
    handleOpen(index) {
      this.hanleOpeneds = index;
    },
  },
};
</script>
```

## 管理员账号管理

管理端需要做的仅仅是将用户名和密码传递给服务器就行，服务器进行散列等加密操作。

```vue
		<el-form label-width="80px">
      <!-- @submit.native.prevent="save" -->
      <el-form-item label="用户名">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="model.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">
          <!-- native-type="submit" -->
          提交</el-button
        >
      </el-form-item>
    </el-form>
```

## 登录页面管理

登录页面`login.vue`的路由应该是和内容平级的，当登录后才能查看到具体的内容。

```js
const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path:"/",
    name:"main",
    component:Main,
    childrens:[...]
  }
}
```

登录组件就是单独的一个页面。

```vue
<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style >
.login-card {
  width: 25rem;
  margin: 5rem auto;
}
</style>
```

前端需要将用户名和密码传递给后端以证明自己的身份。

```js
async login() {
      const res = await this.$http.post("login", this.model); 
    },
```

通过`this.$http.post("login", this.model)`就将model中的数据使用post方法传递给了login这个接口。

### 登录接口报错处理

在http.js中，我们可以全局地捕获错误，统一处理。这是axios中的操作。所以在http.js中写代码。

全局捕获错误，是返回的响应头中处理的。

- 当成功时，直接`return res;`。当失败时进行操作。

- 如果存在错误信息，那么弹出错误提示。

  elementUI中在原型上挂载了一个$message方法，可以传入类型和参数，可以像alert一样弹出提示。

- 如果是401错误，表示登录出错，直接返回登录界面。

```js
http.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.data.message) {
      Vue.prototype.$message({
        type: "error",
        message: err.response.data.message,
      });
      //判断状态码
      if (err.response.status === 401) {
        router.push("/login");
      }
    }
    return Promise.reject(err);
  }
);
```

### 登录并保留token

> admin/src/views/Login.vue

当用户名密码都验证成功时，服务器端就会返回一个token，这时前端接收到token后保存在本地，接着跳转到管理页面，登陆成功。

```js
async login() {
      const res = await this.$http.post("login", this.model);
      //在前端中保存下来token
      localStorage.token = res.data.token;
      console.log(this.$router);
      this.$router.push("/");
      this.$message({
        type: "success",
        message: "登录成功",
      });
    },
```

## 服务器登录校验（jwt）

当前端登录成功后，此时保留了token，当下次再进行访问时，就需要验证token来加载数据。

前端需要进行资源访问时，就需要给http添加拦截器，在http的请求头中添加`Authorization`授权验证信息，将token传递过去。

授权信息的一个规范就是需要在开头加上`"Bear "`，token和Bear中间有一个空格。

`http.interceptors.request.use`也是axios中的，之前的`http.interceptors.response.use`是给响应体添加拦截器拦截状态码。

```js
http.interceptors.request.use(
  function(config) { 
    if (localStorage.token) {
      config.headers.Authorization = "Bearer " + localStorage.token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
```

## 客户端路由限制（beforeEach，meta）

## 上传文件的登录校验

在上传文件的模块中，` :action="$http.defaults.baseURL + '/upload'"`是使用的elementUI底层的ajax请求去请求的，这样是不会带上Authorization授权信息的。所以需要全局设置。