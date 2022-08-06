const config = require("./config");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const webpack = require("webpack");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dest",
  env: {
    customKey: "value",
  },
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    ...config,
  },
  webpack: (config) => {
    config.plugins.push(
      new AntdDayjsWebpackPlugin(),
      // 参数一：忽略什么资源，参数二【可选】：在什么目录下
      new webpack.IgnorePlugin(/^\.\/locale$/, /dayjs$/)
    );
    return config;
  },
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: "static",
      reportFilename: "../bundles/server.html",
    },
    browser: {
      analyzerMode: "static",
      reportFilename: "../bundles/client.html",
    },
  },
};

module.exports = withBundleAnalyzer(nextConfig);
