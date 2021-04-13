import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/scss/style.scss";

import VueAwesomeSwiper from "vue-awesome-swiper";
Vue.use(VueAwesomeSwiper);
import "swiper/css/swiper.css";

import "./assets/iconfont/iconfont.css";

import Card from "./components/Card.vue";
Vue.component("m-card", Card);
import ListCard from "./components/ListCard.vue";
Vue.component("m-list-card", ListCard);

import axios from "axios";
Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "/web/api",
  // baseURL: "http://localhost:3000/web/api",
});

Vue.config.productionTip = false;
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
