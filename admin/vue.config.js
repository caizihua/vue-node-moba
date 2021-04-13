module.exports = {
  // build后的输出路径
  outputDir: __dirname + "/../server/admin",
  publicPath: process.env.NODE_ENV === "production" ? "/admin/" : "/",
};
