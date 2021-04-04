# admin端

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

## 新建与编辑操作整合

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

通过是否传入id可以选择显示编辑还是新建分类。

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

## 分类删除

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

## 图片上传

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

## 英雄编辑

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

- 顺风逆风出装

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

## 编辑英雄技能

el-tabs表示选项卡，默认选中第一个标签页，可以通过 `value` 属性来指定当前选中的标签页。

通过按钮来点击，每点击一次新增一项英雄技能可以编辑名称，技能图标等。



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

