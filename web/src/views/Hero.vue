<template>
  <div class="page-hero" v-if="model">
    <div class="topbar bg-dark-1 py-2 px-4 d-flex ai-center text-white">
      <img src="../assets/logo.png" height="30" />
      <div class="px-2 flex-1">
        <span class="text-white">王者荣耀</span>
        <span class="ml-2">攻略站</span>
      </div>
      <router-link to="/" tag="div">更多英雄 &gt; </router-link>
    </div>
    <div class="top" :style="{ 'background-image': `url(${model.banner})` }">
      <div class="info text-white p-3 d-flex flex-colum h-100 jc-end">
        <div>{{ model.title }}</div>
        <h2 class="my-2">{{ model.name }}</h2>
        <div class="fs-sm">
          {{ model.categories.map((v) => v.name).join("/") }}
        </div>
        <div class="d-flex jc-between pt-2">
          <div class="scores d-flex ai-center" v-if="model.scores">
            <span>难度</span>
            <span class="badge bg-primary"> {{ model.scores.difficult }} </span>
            <span>技能</span>
            <span class="badge bg-blue-1"> {{ model.scores.skills }} </span>
            <span>攻击</span>
            <span class="badge bg-danger"> {{ model.scores.attack }} </span>
            <span>生存</span>
            <span class="badge bg-green-1"> {{ model.scores.survive }} </span>
          </div>
          <router-link tag="span" to="/" class="text-grey fs-sm"
            >皮肤：2 &gt;</router-link
          >
        </div>
      </div>
    </div>
    <!-- end of top -->
    <div class="px-3 bg-white">
      <div class="nav d-flex pt-3 pb-2 jc-around border-bottom">
        <div
          class="nav-item"
          :class="{ active: swiper1 === 0 }"
          @click="
            swiper1 = 0;
            $refs.list.$swiper.slideTo(swiper1);
          "
        >
          <strong class="nav-link">英雄初识</strong>
        </div>
        <div
          class="nav-item"
          :class="{ active: swiper1 === 1 }"
          @click="
            swiper1 = 1;
            $refs.list.$swiper.slideTo(swiper1);
          "
        >
          <strong class="nav-link">进阶攻略</strong>
        </div>
      </div>
    </div>
    <swiper
      ref="list"
      @slideChange="() => (active1 = $refs.list.$swiper.realIndex)"
    >
      <swiper-slide>
        <div>
          <div class="p-3 bg-white border-bottom">
            <div class="d-flex">
              <router-link tag="button" to="/" class="btn btn-lg flex-1">
                <i class="iconfont icon-news"></i>
                英雄介绍视频
              </router-link>
              <router-link tag="button" to="/" class="btn btn-lg flex-1 ml-2">
                <i class="iconfont icon-news"></i>
                英雄介绍视频
              </router-link>
            </div>

            <!-- skills -->
            <div class="skills bg-white mt-4">
              <div class="d-flex jc-around active">
                <img
                  :class="{ active: currentSkillIndex === i }"
                  @click="currentSkillIndex = i"
                  class="icon"
                  :src="item.icon"
                  v-for="(item, i) in model.skills"
                  :key="i"
                  alt=""
                />
              </div>
              <div v-if="currentSkill" class="pt-3 d-flex ai-center">
                <h3>{{ currentSkill.name }}</h3>
                <span class="text-grey-1 ml-4">
                  (冷却值： {{ currentSkill.delay }} 消耗：
                  {{ currentSkill.cost }} )
                </span>
              </div>
              <p>{{ currentSkill.description }}</p>
              <div class="border-bottom"></div>
            </div>
          </div>
          <m-card plain icon="news" title="出装推荐" class="hero-items">
            <div class="fs-xl hero-padding">顺风出装</div>
            <div class="d-flex jc-around text-center mt-3">
              <div v-for="item in model.items1" :key="item.name">
                <img :src="item.icon" alt="" class="icon" />
                <div class="fs-xs">{{ item.name }}</div>
              </div>
            </div>
            <div class="border-bottom mt-3"></div>
            <div class="fs-xl mt-4">逆风出装</div>
            <div class="d-flex jc-around text-center mt-3">
              <div v-for="item in model.items2" :key="item.name">
                <img :src="item.icon" alt="" class="icon" />
                <div class="fs-xs">{{ item.name }}</div>
              </div>
            </div>
          </m-card>
          <m-card plain icon="news" title="使用技巧">
            <p class="m-1">{{ model.usageTips }}</p>
          </m-card>
          <div class="border-bottom"></div>
          <m-card plain icon="news" title="对战技巧">
            <p>{{ model.battleTips }}</p>
          </m-card>
          <div class="border-bottom"></div>
          <m-card plain icon="news" title="团战思路">
            <p>{{ model.teamTips }}</p>
          </m-card>
          <div class="border-bottom"></div>
          <m-card plain icon="news" title="英雄关系">
            <div class="fs-lg pt-2">最佳拍档</div>
            <div
              v-for="item in model.partners"
              :key="item.name"
              class="d-flex pt-3 jc-start"
            >
              <img :src="item.hero.avatar" alt="" height="50" />
              <div class="flex-1 ml-3" style="line-height: 1.5rem">
                {{ item.description }}
              </div>
            </div>
          </m-card>
          <div class="border-bottom"></div>
        </div>
      </swiper-slide>
      <swiper-slide></swiper-slide>
    </swiper>
  </div>
</template>
  
<script>
export default {
  props: {
    id: { required: true },
  },
  data() {
    return {
      model: null,
      currentSkillIndex: 0,
      swiper1: 0,
    };
  },
  computed: {
    currentSkill() {
      return this.model.skills[this.currentSkillIndex];
    },
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`heroes/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    this.fetch();
  },
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";
.page-hero {
  .top {
    height: 50vw;

    background-size: auto 100%;
    background-color: #fff;
    background-repeat: no-repeat;
    // 如果使用background: no-repeat;图片将放大
    background-position: top center;
  }
  .info {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    .scores {
      .badge {
        margin: 0 0.5rem;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        line-height: 0.8rem;
        text-align: center;
        border-radius: 50%;
        border: 0.02rem solid rgb(100, 100, 100);
        font-size: 0.6rem;
      }
    }
  }
  .skills {
    img.icon {
      width: 70px;
      height: 70px;
      border: 3px solid map-get($map: $colors, $key: "white");
      &.active {
        border-color: map-get($map: $colors, $key: "primary");
        border-radius: 45%;
      }
    }
  }
  .hero-items {
    img.icon {
      width: 45px;
      height: 45px;
      border-radius: 50%;
    }
  }
}
</style>