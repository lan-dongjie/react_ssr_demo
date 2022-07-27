const configs = {
  distDir: "dist",
  // 是否给每个路由生成Etage,一般关闭，因为有nginx代理生成了
  generateEtags: true,
  // 页面内容缓存配置
  onDemandEntries: {
    // 内容缓存时长
    maxInactiveAge: 20 * 1000,
    // 缓存个数
    pagesBufferLength: 2,
  },
  // pages 目录下那些后缀文件是页面
  pageExtensions: ["jsx", "js"],
  // buildId 配置
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID;
    }
    // 默认使用unique id
    return null;
  },
  webpack(config, options) {
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
  env: {
    customKey: "value",
  },
  // 服务端渲染才获取的配置，通过next/config读取
  serverRuntimeConfig: {
    mySecret: "secret",
    secondSecret: process.env.SECOND_SECRET,
  },
  // 服务端和客户端渲染都可以读取的静态资源路径
  publicRuntimeConfig: {
    staticFlder: "/static",
  },
};

module.exports = configs;
