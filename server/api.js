// const { default: axios } = require("axios");
// const config = require("../config");
const { request } = require("../lib/api");

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const { path } = ctx;
    if (path.startsWith("/api")) {
      ctx.set("Content-Type", "application/json");
    }

    const startStr = "/api/third_party";
    if (path.startsWith(startStr)) {
      const {
        req,
        url,
        method,
        session: { Auth },
      } = ctx;
      const auth = Auth;
      // const authType = ctx.session.authType;
      const token = auth.access_token;
      let headers = {};
      if (token) {
        headers["Authorization"] = token;
      }
      // const { base_api } = config[authType];
      // if (authType) {
      // }
      try {
        const result = await request({ method, url: url.replace(startStr, ""), data: ctx.request.body || {} }, req);
        ctx.status = result.status;
        if (result.status === 200) {
          ctx.body = result.data;
        } else {
          ctx.body = { success: false, msg: result };
        }
      } catch (error) {
        ctx.body = { success: false, msg: error };
      }
    } else {
      await next();
    }
  });
};

// module.exports = (server) => {
//   server.use(async (ctx, next) => {
//     const { path } = ctx;
//     if (path.startsWith("/api")) {
//       ctx.set("Content-Type", "application/json");
//     }

//     const startStr = "/api/third_party";
//     if (path.startsWith(startStr)) {
//       const auth = Auth;
//       const authType = ctx.session.authType;
//       const token = auth.access_token;
//       let headers = {};
//       if (token) {
//         headers["Authorizat"] = token;
//       }
//       const { base_api } = config[authType];
//       // if (authType) {
//       // }
//       try {
//         const result = await axios({
//           method: "GET",
//           url: ctx.url.replace(startStr, base_api),
//           headers,
//         });
//         if (result.status === 200) {
//           ctx.body = result.data;
//         } else {
//           ctx.status = result.status;
//           ctx.body = { success: false, msg: result };
//         }
//       } catch (error) {
//         ctx.body = { success: false, msg: error };
//       }
//     } else {
//       await next();
//     }
//   });
// };
