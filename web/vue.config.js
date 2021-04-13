module.exports = {
  // build后的输出路径
  outputDir: __dirname + "/../server/web",
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
};
