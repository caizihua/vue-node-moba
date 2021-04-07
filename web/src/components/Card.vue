<template>
  <!-- 卡片公用的样式 -->
  <div>
    <div class="card bg-white mt-2 p-3">
      <div class="card-header d-flex pb-4">
        <i class="iconfont fs-xxs" :class="`icon-${icon}`"></i>
        <div class="fs-xl flex-1 px-2">{{ title }}</div>
        <i class="iconfont fs-xxs">&#xe623;</i>
      </div>
      <div class="card-body">
        <!-- 卡片内部的内容在这里 -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>
  
<style lang="scss">
@import "../assets/scss/_variables.scss";
.card {
  .card-header {
    border-bottom: 1px solid $border-color;
  }
}
</style>

<script>
export default {
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
  },
};
</script>