import Link from "next/link";
import { useEffect } from "react";
import Repo from "./Repo";
import { apis } from "../lib/apis";
import { request } from "../lib/request";
import { withRouter } from "next/router";
import { isServer } from "../utils/util";
import { getCacheRepo, cacheRepo } from "../lib/repo-basic-cache";

function makeQuery(queryObject) {
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join("="));
      return result;
    }, [])
    .join("&");
  return `?${query}`;
}

export default function WithRepoBasic(Comp, type = "index") {
  function RepoBasic({ repoBasic, router, ...rest }) {
    const query = makeQuery(router.query);
    useEffect(() => {
      if (!isServer) {
        cacheRepo(repoBasic);
      }
    });
    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {type === "index" ? (
              <span className="tab index">Readme</span>
            ) : (
              <Link href={`/detail${query}`}>
                <a className="tab index">Readme</a>
              </Link>
            )}
            {type === "issues" ? (
              <span className="tab issues">Issues</span>
            ) : (
              <Link href={`/detail/issues${query}`}>
                <a className="tab issues">Issues</a>
              </Link>
            )}
          </div>
        </div>
        <div className="readme">
          <Comp {...rest} />
        </div>
        <style jsx>
          {`
            .root {
              padding: 20px;
            }
            .repo-basic {
              padding: 20px;
              border: 1px solid #eee;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            .tab + .tab {
              margin-left: 10px;
            }
          `}
        </style>
      </div>
    );
  }
  RepoBasic.getInitialProps = async (context) => {
    const { ctx } = context;
    const { owner, name } = ctx.query;

    const full_name = `${owner}/${name}`;
    let repoBasic = getCacheRepo(full_name);
    if (!repoBasic) {
      const result = await request(
        {
          url: `${apis.repos_detail}/${owner}/${name}`,
        },
        ctx
      );
      // console.log("resultresultresult", result.data);
      if (result.status === 200) {
        repoBasic = result.data;
      }
    }
    let pageData = {};
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context);
    }
    return {
      repoBasic,
      ...pageData,
    };
  };
  return withRouter(RepoBasic);
}
