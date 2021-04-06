<template>
  <div class="about">
    <!-- 根据id显示，如果有就是编辑，如果没有就是新建 -->
    <h1>{{ id ? "编辑" : "新建" }}文章</h1>
    <el-form label-width="80px">
      <!-- @submit.native.prevent="save" -->
      <el-form-item label="所属分类">
        <!-- model中存入或取出parent -->
        <el-select v-model="model.categories" multiple>
          <!-- 展示的是名称，真正存的value是id -->
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <vue-editor
          v-model="model.body"
          useCustomImageHandler
          @image-added="handleImageAdded"
        ></vue-editor>
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
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor,
  },
  //这样就能直接使用id，不用再写
  props: {
    id: {},
  },
  data() {
    return {
      model: {
        name: "",
      },
      categories: [],
    };
  },
  methods: {
    //富文本中插入图片函数
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      //添加file文件
      formData.append("file", file);
      //使用axios向upload地址发送formData
      const res = await this.$http.post("upload", formData);
      //在光标位置插入图片
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
      /* axios({
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
      });*/
    },

    async save() {
      if (this.id) {
        await this.$http.put(`rest/articles/${this.id}`, this.model);
        this.$router.push("/articles/list");
      } else {
        if (this.model.title == "") {
          this.$message({ message: "请输入名称", type: "warning" });
          return false;
        } else {
          await this.$http.post("rest/articles", this.model);
          this.$router.push("/articles/list");
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
      const res = await this.$http.get(`rest/articles/${this.id}`);
      this.model = res.data;
    },
    //获取父级选项分类名称，接口就是categories
    async fetchCategories() {
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
  },
  created() {
    //前面的条件满足才执行后面的函数
    this.id && this.fetch();
    //获取父级分类名
    this.fetchCategories();
  },
};
</script>