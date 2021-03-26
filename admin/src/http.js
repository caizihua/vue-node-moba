import axios from "axios";
const http = axios.create({
  //这是api地址，使用axios进行网络请求
  baseURL: "http://localhost:3000/admin/api",
});

export default http;
