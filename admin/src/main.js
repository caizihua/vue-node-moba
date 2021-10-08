import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import router from "./router";
import http from "./http";

import "./style.css";

Vue.config.productionTip = false;
//获得http
Vue.prototype.$http = http;
//将Authorization混入在每个实例对象中
//全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。
//应该使用的是方法，不应使用data，应为data无法进行实时更新
//当授权信息更新时，混入的授权无法进行更新
Vue.mixin({
  computed: {
    uploadUrl() {
      return this.$http.defaults.baseURL + "/upload";
    },
  },
  methods: {
    getAuthHeaders() {
      return {
        Authorization: `Bearer ${localStorage.token || ""}`,
      };
    },
  },
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");