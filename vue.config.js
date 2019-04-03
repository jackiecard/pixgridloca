module.exports = {
  transpileDependencies: ["vuex-persist"],
  baseUrl: process.env.NODE_ENV === "production" ? "/pixgrid/" : "/",
};
