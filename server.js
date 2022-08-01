const Koa = require("koa");
const next = require("next");
const cp = require("child_process");
const Router = require("koa-router");
const session = require("koa-session");
const koaBody = require("koa-body");
const { default: Redis } = require("ioredis");
const RedisSessionStore = require("./server/session-store");
const auth = require("./server/auth");
const api = require("./server/api");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const redis = new Redis({
  port: 6379, // Redis port 【端口号】
  host: "127.0.0.1", // Redis host 【主机默认：127.0.0.1】
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  const session_signed_key = ["app oauth"];
  const SESSION_CONFIG = {
    key: "jid" /**  cookie的key。 (默认是 koa:sess) */,
    maxAge: 60 * 1000 /**  session 过期时间，以毫秒ms为单位计算 。*/,
    // cookie: { maxAge: 1 * 60 * 60 * 1000 },
    store: new RedisSessionStore(redis),
    // autoCommit: true /** 自动提交到响应头。(默认是 true) */,
    // overwrite: true /** 是否允许重写 。(默认是 true) */,
    // httpOnly: true /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */,
    // signed: true /** 是否签名。(默认是 true) */,
    // rolling: true /** 是否每次响应时刷新Session的有效期。(默认是 false) */,
    // renew: false /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */,
  };
  server.keys = session_signed_key;
  server.use(koaBody());
  server.use(session(SESSION_CONFIG, server));
  // server.use(async (ctx, next) => {
  //   if (ctx.path === "/Login") {
  //     ctx.session.aaa = "aaaa";
  //     ctx.response.set("Access-Control-Allow-Credentials", true);
  //     ctx.redirect("/detail");
  //     console.log("aaaaaaaaaa", ctx.session);
  //     ctx.session.aaa = "aaaa";
  //   } else {
  //     await next();
  //   }
  // });
  // server.use(async (ctx, next) => {
  //   console.log("qqqqqqqqqqqqqqqq", ctx.session);
  //   await next();
  // });
  // 必须在use session 后
  auth(server);
  api(server);
  // server.use(async (ctx, next) => {
  //   console.log("session is:", ctx.session);
  //   await next();
  // });
  // 后面的中间件可能已经用到了auth
  server.use(router.routes());
  server.use(async (ctx, next) => {
    // ctx.session.userInfo = { name: "sssss" };
    ctx.req.session = ctx.session;
    await handle(ctx.req, ctx.res);
    // 如果不设置false，koa会设置body,而handle已经设置好了body
    ctx.respond = false;
    await next();
  });
  // server.use(async (ctx, next) => {
  //   ctx.req.statusCode = 200;
  //   await next();
  // });
  // 配置github OAuth 登录
  server.listen(3000, () => {
    const serverUrl = "http://localhost:3000";
    console.log("koa server listening on 3000");
    // 开发环境自动启动
    if (dev) {
      switch (process.platform) {
        //mac系统使用 一下命令打开url在浏览器
        case "darwin":
          cp.exec(`open ${serverUrl}`);
          break;
        //win系统使用 一下命令打开url在浏览器
        case "win32":
          cp.exec(`start ${serverUrl}`);
          break;
        // 默认mac系统
        default:
          cp.exec(`open ${serverUrl}`);
      }
    }
  });
});
