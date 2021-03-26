//服务端代码
const express = require("express");

const app = express();
//使用JSON
app.use(express.json());
//直接使用跨域模块
app.use(require("cors")());

require("./routes/admin")(app);
require("./plugins/db")(app);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
