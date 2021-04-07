<template>
  <!-- 路由中内容 -->
  <div>
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper1.jpeg" alt="" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper2.jpeg" alt="" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper3.jpeg" alt="" />
      </swiper-slide>
      <div
        class="swiper-pagination pagination-home text-right px-3 pb-2"
        slot="pagination"
      ></div>
    </swiper>
    <!-- end of swiper -->
    <div class="nav-icons bg-white mt-3 text-center pt-3 text-dark-1">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3" v-for="(items, i) in sprite" :key="i">
          <i class="sprite" :class="`sprite-${items.icons}`"></i>
          <div class="py-2">{{ items.name }}</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-sm d-flex ai-center jc-center">
        <i class="sprite sprite-arrow mr-1"></i>
        收起
      </div>
    </div>
    <!-- end of nav icons -->
    <!-- 卡片需要的数据 -->
    <m-list-card icon="Menu" title="新闻资讯" :categories="newsCats">
      <!-- 卡片列表中的数据需要用插槽传递 -->
      <template #items="{ category1 }">
        <div class="py-2" v-for="(news, i) in category1.newsList" :key="i">
          <span>[{{ news.categoryName }}]</span>
          <span>|</span>
          <span>{{ news.title }}</span>
          <span>{{ news.data }}</span>
        </div>
      </template>
    </m-list-card>

    <m-card icon="Artifact-yingxiong" title="英雄列表"> </m-card>
    <m-card icon="Artifact-yingxiong" title="精彩视频"> </m-card>
    <m-card icon="Artifact-yingxiong" title="图文攻略"> </m-card>
    <div v-for="n in 50" :key="n">1</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // swiper
      swiperOptions: {
        loop: true,
        autoplay: true, // 自动轮播
        pagination: {
          el: ".pagination-home",
        },
      },
      sprite: [
        { icons: "news", name: "爆料站" },
        { icons: "stories", name: "故事站" },
        { icons: "shop", name: "周边商城" },
        { icons: "experience", name: "体验服" },
        { icons: "couple", name: "新人专区" },
        { icons: "glory", name: "荣耀传承" },
        { icons: "fan", name: "同人社区" },
        { icons: "camp", name: "王者营地" },
        { icons: "public", name: "公众号" },
      ],
      newsCats: [
        {
          name: "热门",
          newsList: new Array(5).fill({}).map(() => ({
            categoryName: "公告",
            title: "4月6日体验服停机更新公告",
            data: "06/01",
          })),
        },
        {
          name: "新闻",
          newsList: new Array(3).fill({}).map(() => ({
            categoryName: "公告",
            title: "4月6日体验服停机更新公告",
            data: "06/01",
          })),
        },
        {
          name: "公告",
          newsList: new Array(4).fill({}).map(() => ({
            categoryName: "公告",
            title: "4月6日体验服停机更新公告",
            data: "06/01",
          })),
        },
        {
          name: "活动",
          newsList: new Array(3).fill({}).map(() => ({
            categoryName: "公告",
            title: "4月6日体验服停机更新公告",
            data: "06/01",
          })),
        },
        {
          name: "赛事",
          newsList: new Array(2).fill({}).map(() => ({
            categoryName: "公告",
            title: "4月6日体验服停机更新公告",
            data: "06/01",
          })),
        },
      ],
    };
  },
};
</script>


<style lang="scss">
@import "../assets/scss/variables.scss";
// swiper
.pagination-home {
  .swiper-pagination-bullet {
    opacity: 1;
    border-radius: 0.1538rem;
    background: white;
    &.swiper-pagination-bullet-active {
      background: map-get($colors, "info");
    }
  }
}
//nav icons
.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-item {
    width: 25%;
    border-right: 1px solid $border-color;
    &:nth-child(4n) {
      border-right: none;
    }
  }
}
@mixin sprite-1 {
  margin-top: 0.1rem;
}
.sprite-arrow {
  @include sprite-1;
}
</style>