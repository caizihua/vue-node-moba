import axios from "axios";
import Vue from "vue";
import router from "./router";
const http = axios.create({
  //这是api地址，使用axios进行网络请求
  baseURL: "http://localhost:3000/admin/api",
});

//给http添加拦截器
http.interceptors.request.use(
  function(config) {
    //给请求头添加授权信息Authorization
    if (localStorage.token) {
      config.headers.Authorization = "Bearer " + localStorage.token;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

//全局捕获错误
//给http加全局捕获器
http.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    //不是返回成功的状态会在这里
    // elementUI中在原型上挂载了一个$message方法，可以传入类型和参数，可以像alert一样弹出提示
    if (err.response.data.message) {
      Vue.prototype.$message({
        type: "error",
        message: err.response.data.message,
      });
      //判断状态码
      if (err.response.status === 401) {
        router.push("/login");
      }
    }

    return Promise.reject(err);
  }
);

export default http;
