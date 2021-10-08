<template>
  <el-row>
    <el-col :span="12">
      <h1>物品列表</h1>
      <!--:data提供数据 -->
      <el-table :data="items">
        <el-table-column prop="_id" label="ID" width="250"> </el-table-column>
        <el-table-column prop="name" label="物品名称"> </el-table-column>
        <el-table-column prop="icon" label="物品图标">
          <template slot-scope="scope">
            <img :src="scope.row.icon" style="height: 2.5rem" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="190">
          <template slot-scope="scope">
            <!-- scope.row表示当前这一行的数据 -->
            <el-button
              type="primary"
              size="small"
              @click="$router.push(`/items/edit/${scope.row._id}`)"
              >编辑</el-button
            >
            <!-- 将整行的数据传给remove方法 -->
            <el-button type="primary" size="small" @click="remove(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
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
      const res = await this.$http.get("rest/items");
      this.items = res.data;
    },
    remove(row) {
      this.$confirm(`是否确定删除分类："${row.name}"？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/items/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.fetch();
      });
    },
  },
  created() {
    this.fetch();
  },
};
</script>