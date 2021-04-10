<template>
  <div class="page-article" v-if="model">
    <div class="d-flex py-3 px-1 border-bottom">
      <router-link
        tag="i"
        :to="`/`"
        class="iconfont icon-back1 pr-1 text-info-1"
      ></router-link>
      <strong class="flex-1 text-ellipsis text-info-1">
        {{ model.title }}
      </strong>
      <div class="text-grey fs-sm pl-3 fs-lg pr-1">2020-09-09</div>
    </div>
    <div v-html="model.body" class="body px-2"></div>
    <div class="px-3 pb-5 border-top">
      <div class="d-flex ai-center py-2">
        <i class="iconfont icon-lianjie"></i>
        <strong class="fs-lg ml-2 text-info-1">相关资讯</strong>
      </div>
      <router-link
        :to="`/articles/${item._id}`"
        tag="div"
        v-for="(item, i) in model.related"
        :key="i"
        class="py-1"
      >
        {{ item.title }}
      </router-link>
    </div>
  </div>
</template>
  
<script>
export default {
  //所有在路由中传入的参数，都映射为组件props参数
  props: {
    id: { required: true },
  },
  data() {
    return {
      model: null,
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`articles/${this.id}`);
      console.log(res);
      this.model = res.data;
    },
  },
  created() {
    this.fetch();
  },
  watch: {
    id: "fetch",
    // id() {
    //   this.fetch();
    // },
  },
};
</script>

<style lang="scss">
.page-article {
  .icon-back1 {
    font-size: 1.5385rem;
  }
  .body {
    img {
      max-width: 98%;
      height: auto;
    }
    iframe {
      width: 100%;
      height: auto;
    }
  }
  .icon-lianjie {
    font-size: 1.6923rem !important;
  }
}
</style>