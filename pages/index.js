import api from "../lib/api";

export default function Index() {
  return <span>Index</span>;
}

Index.getInitialProps = async ({ ctx, reduxStoore }) => {
  let data = {};
  // const user = reduxStoor.getState().user;
  // if (!user || !user.id) {
  //   return {
  //     isLogin: false,
  //   };
  // }
  if (ctx.req && ctx.req.session && ctx.req.session.Auth) {
    const result = api.request(
      {
        url: "/api/third_party/search/respositories?q=react",
      },
      ctx.req,
      ctx.res
    );
    data = result.data;
  }

  return {
    data,
    isLogin: true,
  };
};
