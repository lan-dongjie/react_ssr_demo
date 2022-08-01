const config = require("./config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    ...config,
  },
};

module.exports = nextConfig;
