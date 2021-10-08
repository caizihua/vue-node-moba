<template>
  <div>
    <h1>{{ id ? "编辑" : "新建" }}物品</h1>
    <el-col :span="12" class="about" v-for="n in 4" :key="n">
      <el-form style="margin-bottom: 50px">
        <el-form-item label="图标" style="margin-bottom: 0">
          <!-- action表示地址，提交到哪个接口 -->
          <!-- 默认参数中有个baseURL 这是我们在配置axios中自己定义的 -->
          <!-- on-success表示成功后返回的参数中找到地址赋给model.icon展示出图标 -->
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="getAuthHeaders()"
            :show-file-list="false"
            :on-success="afterUpload"
          >
            <!-- 如果有图片地址就显示图片，没有就显示上传图标 -->
            <img v-if="model.icon" :src="model.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="model.name" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save"> 提交</el-button>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
export default {
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
      if (this.id) {
        await this.$http.put(`rest/items/${this.id}`, this.model);
        this.$router.push("/items/list");
      } else {
        if (this.model.name == "") {
          this.$message({ message: "请输入名称", type: "warning" });
          return false;
        } else {
          await this.$http.post("rest/items", this.model);
          this.$router.push("/items/list");
        }
      }
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/items/${this.id}`);
      this.model = res.data;
    },
    afterUpload(res) {
      //1.后端传来的对象res，其中就包括了地址
      //这里应注意，如果data的model里面没有定义icon，这样赋值将不会响应
      //因为可能是响应式问题，没有定义icon这样在对icon赋值是没有意义的，也不会显示的
      //可以显式地$set为对象添加不存在的属性。
      // this.model.icon = res.url;
      //2.使用$set时也应注意，如果对象已经添加了该属性，再这样添加也不会响应，应该是添加没有的属性
      this.$set(this.model, "icon", res.url);
    },
  },
  created() {
    this.id && this.fetch();
  },
};
</script>