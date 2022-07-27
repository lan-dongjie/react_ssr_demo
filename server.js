const Koa = require("koa");
const next = require("next");
const Router = require("koa-router");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  // router.get("/", (ctx) => {
  //   ctx.body = "<p>React + Next + Koa2</p><a  href='/a'>to a</><br/><a  href='/test'>to test</>";
  // });
  // router.get("/test", (ctx) => {
  //   ctx.body = "<span> request /test</span>";
  // });
  router.get("/detail:id", (ctx) => {
    ctx.body = `<span> request /detail ${ctx.params.id}</span>`;
  });
  router.get("/api/test", (ctx) => {
    ctx.body = { success: true };
    ctx.set("Content-Type", "application/json");
  });
  // server.use(async (ctx, next) => {
  //   const { path, method } = ctx;
  //   ctx.body = `<span> Koa Render ${method} ${path} </span>`;

  //   await next();
  // });

  server.use(router.routes());
  server.use(async (ctx, next) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    await next();
  });

  server.listen(3000, () => {
    console.log("koa server listening on 3000");
  });
});
