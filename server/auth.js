const axios = require("axios");
const config = require("../config");

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === "/auth") {
      const code = ctx.query.code;
      const authType = ctx.query.type || "github";
      const { getTokenPostData, request_token_url, user_info_url } = config[authType];
      ctx.session.authType = authType;
      if (!code) {
        ctx.body = "code not exist";
        return;
      }
      const result = await axios({
        method: "POST",
        url: request_token_url,
        data: getTokenPostData(code),
        headers: {
          Accept: "application/json",
        },
      });
      if (result.status === 200 && result.data && !result.data.error) {
        ctx.session.Auth = result.data;
        const { access_token, token_type } = result.data;
        const userInfoResp = await axios({
          method: "GET",
          url: user_info_url,
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        });
        ctx.session.userInfo = userInfoResp.data;
        console.log("111111111111", ctx.session.userInfo);

        let redirect_url = "/";
        if (ctx.session.urlBeforeOauth && ctx.session.urlBeforeOauth === "/Login") {
          redirect_url = ctx.session.urlBeforeOauth;
        }
        ctx.redirect(redirect_url);
        ctx.session.urlBeforeOauth = "";
      } else {
        ctx.body = `request token failed: ${result.message || result.data.error}`;
      }
    } else {
      await next();
    }
  });
  server.use(async (ctx, next) => {
    const { path, method } = ctx;
    if (path === "/logout" && method === "POST") {
      ctx.session = null;
      ctx.body = `logout success`;
    } else {
      await next();
    }
  });
  server.use(async (ctx, next) => {
    const { path, method } = ctx;
    if (path === "/prepare-auth" && method === "GET") {
      const { url } = ctx.query;
      ctx.session.urlBeforeOauth = url;
      ctx.body = `ready`;
    } else {
      await next();
    }
  });
};
