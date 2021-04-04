<template>
  <div class="about">
    <!-- 根据id显示，如果有就是编辑，如果没有就是新建 -->
    <h1>{{ id ? "编辑" : "新建" }}管理员</h1>
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
    };
  },
  methods: {
    async save() {
      //对于新建和编辑，保存的方法不一样，一个是post，一个是put
      //async await将类似同步的写法写成异步
      // let res;
      if (this.id) {
        await this.$http.put(`rest/admin_users/${this.id}`, this.model);
        this.$router.push("/admin_users/list");
      } else {
        if (this.model.username == "") {
          this.$message({ message: "请输入名称", type: "warning" });
          return false;
        } else {
          await this.$http.post("rest/admin_users", this.model);
          this.$router.push("/admin_users/list");
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
      const res = await this.$http.get(`rest/admin_users/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    //前面的条件满足才执行后面的函数
    this.id && this.fetch();
  },
};
</script>