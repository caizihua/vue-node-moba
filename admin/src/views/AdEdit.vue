<template>
  <div class="about">
    <!-- 根据id显示，如果有就是编辑，如果没有就是新建 -->
    <h1>{{ id ? "编辑" : "新建" }}广告位</h1>
    <el-form label-width="80px">
      <!-- @submit.native.prevent="save" -->
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" @click="save">
          <!-- native-type="submit" -->
          保存</el-button
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
        items: [],
      },
    };
  },
  methods: {
    async save() {
      //对于新建和编辑，保存的方法不一样，一个是post，一个是put
      //async await将类似同步的写法写成异步
      // let res;
      if (this.id) {
        await this.$http.put(`rest/ads/${this.id}`, this.model);
        this.$router.push("/ads/list");
      } else {
        if (this.model.name == "") {
          this.$message({ message: "请输入名称", type: "warning" });
          return false;
        } else {
          await this.$http.post("rest/ads", this.model);
          this.$router.push("/ads/list");
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
      const res = await this.$http.get(`rest/ads/${this.id}`);
      this.model = Object.assign({}, this.model, res.data);
    },
  },
  created() {
    //前面的条件满足才执行后面的函数
    this.id && this.fetch();
  },
};
</script>