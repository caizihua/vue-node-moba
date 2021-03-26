import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import CategoryEdit from "../views/CategoryEdit.vue";
import CategoryList from "../views/CategoryList.vue";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    component: Main,
    children: [
      {
        path: "/categories/create",
        component: CategoryEdit,
      },
      {
        //不同的地址使用相同的组件，传入id，props为true表示将数据传入组件中
        path: "/categories/edit/:id",
        component: CategoryEdit,
        props: true,
      },
      {
        path: "/categories/list",
        component: CategoryList,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
