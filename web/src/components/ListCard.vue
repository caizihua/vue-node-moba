<template>
  <!-- 卡片列表除公用的样式 -->
  <div>
    <!-- 卡片头接着里面就有卡片的公用内容 -->
    <m-card :icon="icon" :title="title">
      <div class="border-bottom"></div>
      <div class="nav jc-between pt-3">
        <div
          class="nav-item"
          :class="{ active: active1 === i }"
          v-for="(category, i) in categories"
          :key="i"
          @click="$refs.list.$swiper.slideTo(i)"
        >
          <div class="nav-link">{{ category.name }}</div>
        </div>
      </div>
      <div class="pt-3">
        <!-- ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。 -->
        <swiper
          :options="{ autoHeight: true }"
          ref="list"
          @slideChange="() => (active1 = $refs.list.$swiper.realIndex)"
        >
          <swiper-slide v-for="(category2, i) in categories" :key="i">
            <!-- 卡片轮播中的内容 -->
            <slot name="items" :category1="category2"></slot>
          </swiper-slide>
        </swiper>
      </div>
    </m-card>
  </div>
</template>
  
<script>
export default {
  props: {
    //Home.vue传来的数据
    icon: { type: String, required: true },
    title: { type: String, required: true },
    categories: { type: Array, required: true },
  },
  data() {
    return {
      //定义激活状态高亮
      active1: 0,
    };
  },
};
</script>