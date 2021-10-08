//服务端代码
const express = require("express");

const app = express();

var fs = require("fs");

// 全局中配置秘密字段 
fs.readFile(__dirname + "/a.txt", function (err, data) {
  if (err) {
    return err;
  } else {
    app.set("secret", data.toString());
  }
});
//使用JSON
app.use(express.json());
//直接使用跨域模块
app.use(require("cors")());
//开放一个端口uploads前端好访问其中的文件，地址就是静态的端口
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/admin/", express.static(__dirname + "/admin"));
app.use("/", express.static(__dirname + "/web"));

require("./routes/admin")(app);
require("./plugins/db")(app);
require("./routes/web")(app);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
