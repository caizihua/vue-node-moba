<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}英雄</h1>
    <el-form label-width="80px" type="border-card">
      <!-- 当value取某个值时，就会默认跳转到el-tab-pane中相应的name属性值的表格 -->
      <el-tabs value="basic">
        <el-tab-pane label="基础信息" name="basic">
          <el-form :inline="true">
            <el-form-item label="名称">
              <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item label="称号">
              <el-input v-model="model.title"></el-input>
            </el-form-item>
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
          </el-form>
          <el-form label-position="left" label-width="60px">
            <el-form-item label="头像">
              <!-- action表示地址，提交到哪个接口 -->
              <!-- 默认参数中有个baseURL 这是我们在配置axios中自己定义的 -->
              <!-- on-success表示成功后返回的参数中找到地址赋给model.icon展示出图标 -->
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="(res) => (model.avatar = res.url)"
              >
                <!-- 如果有图片地址就显示图片，没有就显示上传图标 -->
                <img v-if="model.avatar" :src="model.avatar" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="Banner">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="(res) => $set(model, 'banner', res.url)"
              >
                <img v-if="model.banner" :src="model.banner" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-form :inline="true">
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
          </el-form>
          <el-form :inline="true">
            <el-form-item label="顺风出装">
              <!-- 添加multiple字段就能进行多选 -->
              <el-select v-model="model.items1" multiple>
                <el-option
                  v-for="item of items"
                  :key="item.id"
                  :value="item._id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="逆风出装">
              <!-- 添加multiple字段就能进行多选 -->
              <el-select v-model="model.items2" multiple>
                <el-option
                  v-for="item of items"
                  :key="item.id"
                  :value="item._id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form>
            <el-form-item label="使用技巧">
              <el-input type="textarea" v-model="model.usageTips"></el-input>
            </el-form-item>
            <el-form-item label="对抗技巧">
              <el-input type="textarea" v-model="model.battleTips"></el-input>
            </el-form-item>
            <el-form-item label="团战思路">
              <el-input type="textarea" v-model="model.teamTips"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="技能" name="skills">
          <!-- 添加新技能，给skills push一个新对象 -->
          <el-button @click="model.skills.push({})" style="margin-bottom: 1rem">
            <i class="el-icon-plus"></i>添加技能
          </el-button>
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col :md="12" v-for="(item, i) in model.skills" :key="i">
              <el-form label-position="left" label-width="60px">
                <el-form-item label="名称">
                  <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :headers="getAuthHeaders()"
                    :show-file-list="false"
                    :on-success="(res) => $set(item, 'icon', res.url)"
                  >
                    <!-- 如果有图片地址就显示图片，没有就显示上传图标 -->
                    <img v-if="item.icon" :src="item.icon" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-position="left" label-width="60px">
                <el-form-item label="冷却值">
                  <el-input v-model="item.delay"></el-input>
                </el-form-item>
                <el-form-item label="消耗">
                  <el-input v-model="item.cost"></el-input>
                </el-form-item>
              </el-form>
              <el-form label-position="left" label-width="60px">
                <el-form-item label="描述">
                  <el-input
                    type="textarea"
                    v-model="item.description"
                  ></el-input>
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
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="最佳搭档" name="partners">
          <el-button
            @click="model.partners.push({})"
            style="margin-bottom: 1rem"
          >
            <i class="el-icon-plus"></i>添加英雄
          </el-button>
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col :md="12" v-for="(item, i) in model.partners" :key="i">
              <el-form-item label="英雄">
                <el-select filterable v-model="item.hero">
                  <el-option
                    v-for="hero in heroes"
                    :key="hero._id"
                    :value="hero._id"
                    :label="hero.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="small"
                  type="danger"
                  @click="model.partners.splice(i, 1)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-form-item style="margin-top: 1rem">
        <el-button type="primary" @click="save"> 提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.el-form-item {
  padding-right: 1.5385rem;
}
</style>

<script>
export default {
  props: {
    id: {},
  },
  data() {
    return {
      categories: [],
      items: [],
      heroes: [],
      model: {
        name: "",
        avatar: "",
        banner: "",
        scores: {
          difficult: 0,
        },
        skills: [],
        partners: [],
      },
    };
  },
  methods: {
    async save() {
      if (this.id) {
        await this.$http.put(`rest/heroes/${this.id}`, this.model);
        this.$router.push("/heroes/list");
      } else {
        if (this.model.name == "") {
          this.$message({ message: "请输入名称", type: "warning" });
          return false;
        } else {
          await this.$http.post("rest/heroes", this.model);
          this.$router.push("/heroes/list");
        }
      }
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/heroes/${this.id}`);
      //直接赋值是替换了原来的model，而且我们在原来的model中定义了scores分数等级会被覆盖
      //需要使用assign方法将res.data中的数据赋给model，而不是直接替换
      //this.model = res.data
      this.model = Object.assign({}, this.model, res.data);
    },
    async fetchCategories() {
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
    async fetchItems() {
      const res = await this.$http.get(`rest/items`);
      this.items = res.data;
    },
    async fetchHeroes() {
      const res = await this.$http.get(`rest/heroes`);
      this.heroes = res.data;
    },
  },
  created() {
    this.fetchItems();
    this.fetchHeroes();
    this.fetchCategories();
    this.id && this.fetch();
  },
};
</script>