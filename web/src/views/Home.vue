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
    <div
      class="nav-icons bg-white mt-3 d-flex flex-wrap text-center pt-3 text-dark-1"
    >
      <div class="nav-item mb-3" v-for="(items, i) in sprite" :key="i">
        <i class="sprite" :class="items.icons"></i>
        <div class="py-2">{{ items.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/scss/variables.scss";
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
.nav-icons {
  .nav-item {
    width: 25%;
    border-right: 1px solid $border-color;
  }
}
</style>
  
<script>
export default {
  data() {
    return {
      swiperOptions: {
        loop: true,
        autoplay: true, // 自动轮播
        pagination: {
          el: ".pagination-home",
        },
      },
      sprite: [
        { icons: "sprite-news", name: "爆料站" },
        { icons: "sprite-stories", name: "故事站" },
        { icons: "sprite-shop", name: "周边商城" },
        { icons: "sprite-experience", name: "体验服" },
        { icons: "sprite-couple", name: "新人专区" },
        { icons: "sprite-glory", name: "荣耀传承" },
        { icons: "sprite-fan", name: "同人社区" },
        { icons: "sprite-camp", name: "王者营地" },
        { icons: "sprite-public", name: "公众号" },
        { icons: "sprite-version", name: "版本介绍" },
      ],
    };
  },
};
</script>