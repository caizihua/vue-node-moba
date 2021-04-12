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
        <router-link
          tag="div"
          :to="`/articles/${news._id}`"
          class="py-2 fs-lg d-flex"
          v-for="(news, i) in category1.newsList"
          :key="i"
        >
          <span class="text-info">[{{ news.categoryName }}]</span>
          <span class="px-2">|</span>
          <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{
            news.title
          }}</span>
          <span class="text-grey fs-sm">{{ news.createdAt | date }}</span>
        </router-link>
      </template>
    </m-list-card>

    <m-list-card
      icon="Artifact-yingxiong"
      title="英雄列表"
      :categories="heroCats"
    >
      <!-- 卡片列表中的数据需要用插槽传递 -->
      <template #items="{ category1 }">
        <div class="d-flex flex-wrap jc-between">
          <router-link
            tag="div"
            :to="`/heroes/${hero._id}`"
            class="p-2 text-center"
            style="width: 20%"
            v-for="(hero, i) in category1.heroList"
            :key="i"
          >
            <img :src="hero.avatar" class="w-100" />
            <div>{{ hero.name }}</div>
          </router-link>
        </div>
      </template>
    </m-list-card>
    <m-card icon="Artifact-yingxiong" title="精彩视频"> </m-card>
    <m-card icon="Artifact-yingxiong" title="图文攻略"> </m-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  filters: {
    date(val) {
      return dayjs(val).format("MM/DD");
    },
  },
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
      newsCats: [],
      heroCats: [],
    };
  },
  methods: {
    async fetchNewsCats() {
      const res = await this.$http.get("news/list");
      this.newsCats = res.data;
    },
    async fetchHeroCats() {
      const res = await this.$http.get("heroes/list");
      this.heroCats = res.data;
    },
  },
  created() {
    this.fetchNewsCats();
    this.fetchHeroCats();
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