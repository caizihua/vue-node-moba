<template>
  <div class="about">
    <!-- 根据id显示，如果有就是编辑，如果没有就是新建 -->
    <h1>{{ id ? "编辑" : "新建" }}分类</h1>
    <el-form label-width="80px">
      <!-- @submit.native.prevent="save" -->
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
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">
          <!-- native-type="submit" -->
          提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  //这样就能直接使用id，不用再写
  props: {
    id: {},
  },
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
    async save() {
      //对于新建和编辑，保存的方法不一样，一个是post，一个是put
      //async await将类似同步的写法写成异步
      // let res;
      if (this.id) {
        await this.$http.put(`rest/categories/${this.id}`, this.model);
        this.$router.push("/categories/list");
      } else {
        if (this.model.name == "") {
          this.$message({ message: "请输入名称", type: "warning" });
          return false;
        } else {
          await this.$http.post("rest/categories", this.model);
          this.$router.push("/categories/list");
        }
      }
      //跳转到分类页面

      //提示保存成功
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    //获取分类的详情
    async fetch() {
      const res = await this.$http.get(`rest/categories/${this.id}`);
      this.model = res.data;
    },
    //获取父级选项分类名称，接口就是categories
    async fetchParents() {
      const res = await this.$http.get(`rest/categories`);
      this.parents = res.data;
    },
  },
  created() {
    //前面的条件满足才执行后面的函数
    this.id && this.fetch();
    //获取父级分类名
    this.fetchParents();
  },
};
</script>