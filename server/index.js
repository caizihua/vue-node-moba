//服务端代码
const express = require("express");

const app = express();
//使用JSON
app.use(express.json());
//直接使用跨域模块
app.use(require("cors")());
//开放一个端口uploads前端好访问其中的文件，地址就是静态的端口
app.use("/uploads", express.static(__dirname + "/uploads"));

require("./routes/admin")(app);
require("./plugins/db")(app);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
