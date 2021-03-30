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

