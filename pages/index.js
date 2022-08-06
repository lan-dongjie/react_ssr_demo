import { Tabs } from "antd";
import { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { apis } from "../lib/apis";
import Repo from "../components/Repo";
import { request } from "../lib/request";
import { isServer } from "../utils/util";
import UserInfo from "../components/UserInfo";
import { cacheRepos } from "../lib/repo-basic-cache";

// import LRU from "lru-cache";

// const cache = new LRU({
//   ttl: 1000 * 60,
//   maxSize: 5000,
// });
let cachedUserRepos;

let cachedUserStaredRepos;
function Index({ user, data, router }) {
  // console.log("data", data);
  const { repos, stared } = data;
  const tabKey = router.query.key || "1";
  const handleTabChange = (activeKey) => {
    router.push(`/?key=${activeKey}`);
  };
  useEffect(() => {
    if (!isServer) {
      // cachedUserRepos = repos.length ? repos : undefined;
      // cachedUserStaredRepos = stared.length ? stared : undefined;
      if (repos.length) {
        // cache.set("userRepos", repos);
        cachedUserRepos = repos;
        cacheRepos(repos);
      }
      if (stared.length) {
        // cache.set("userStared", stared);
        cachedUserStaredRepos = stared;
        cacheRepos(stared);
      }
      setTimeout(() => {
        cachedUserRepos = undefined;
        cachedUserStaredRepos = undefined;
      }, 1000 * 60 * 10);
    }
  }, [repos, stared]);

  return (
    <div className="root">
      {user && user.id ? (
        <>
          <UserInfo />
          <div className="user-repos">
            <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
              <Tabs.TabPane tab="你的仓库" key="1">
                {data.repos.map((item) => {
                  return <Repo key={item.id} repo={item} />;
                })}
              </Tabs.TabPane>
              <Tabs.TabPane tab="你关注的仓库" key="2">
                {data.stared.map((item) => {
                  return <Repo key={item.id} repo={item} />;
                })}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </>
      ) : (
        <a href="/Login">去登录</a>
      )}
      <style jsx>
        {`
          .root {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 10px;
          }
          .user-repos {
            flex: 1;
          }
        `}
      </style>
    </div>
  );
}

Index.getInitialProps = async ({ ctx, reduxStore }) => {
  const user = reduxStore.getState().user;
  // let cachedUserRepos = cache.get("userRepos");

  // let cachedUserStaredRepos = cache.get("userStared");

  let data = { repos: cachedUserRepos || [], stared: cachedUserStaredRepos || [] };
  if (!user || !user.id) {
    return {
      data,
      isLogin: false,
    };
  }
  if (!isServer) {
    if (cachedUserRepos && cachedUserStaredRepos) {
      return {
        data,
        isLogin: true,
      };
    }
  }
  if (ctx && ctx.req && ctx.req.session && ctx.req.session.Auth) {
    try {
      const reposResult = await request(
        {
          url: apis.user_repos,
        },
        ctx
      );

      if (reposResult.status === 200) {
        data.repos = reposResult.data;
      }
      const staredResult = await request(
        {
          url: apis.user_repos,
        },
        ctx
      );

      if (staredResult.status === 200) {
        data.stared = staredResult.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return {
    data,
    isLogin: true,
  };
};

export default withRouter(
  connect(function mapState(state) {
    return {
      user: state.user,
    };
  })(Index)
);
