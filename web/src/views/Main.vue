<template>
  <div>
    <!-- 主页面中的顶部导航栏 -->
    <div class="topbar bg-dark-1 py-2 px-4 d-flex ai-center">
      <img src="../assets/logo.png" height="30" />
      <div class="px-2 flex-1">
        <div class="text-white">王者荣耀</div>
        <div class="text-grey-1 fs-xxs">团队成就更多</div>
      </div>
      <button href="" class="btn bg-primary" type="button">立即下载</button>
    </div>
    <div class="bg-primary pt-3 pb-2">
      <div class="nav nav-inverse jc-around">
        <div class="nav-item active">
          <router-link class="nav-link" to="/" tag="div">首页</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/" tag="div">攻略中心</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/" tag="div">赛事中心</router-link>
        </div>
      </div>
    </div>
    <!-- 子路由装填内容 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style>
.topbar {
  position: sticky;
  top: 0;
  z-index: 999;
}
</style>
