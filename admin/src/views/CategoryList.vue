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