import { withRouter } from "next/router";
import { apis } from "../lib/apis";
import { request } from "../lib/request";
import { Row, Col, List, Pagination } from "antd";
import Router from "next/router";
import { useCallback, isValidElement, useEffect } from "react";
import Repo from "../components/Repo";
import { isServer } from "../utils/util";
import { cacheRepos } from "../lib/repo-basic-cache";

const LANGUAGES = ["JavaScript", "HTML", "CSS", "TypeScript"];
const SORT_TYPES = [
  {
    name: "Best Match",
  },
  {
    name: "Most Stars",
    value: "stars",
    order: "desc",
  },
  {
    name: "Fewest Stars",
    value: "stars",
    order: "asc",
  },
  {
    name: "Most Forks",
    value: "forks",
    order: "desc",
  },
  {
    name: "Fewest Forks",
    value: "forks",
    order: "asc",
  },
];

const selectedItemsStyle = {
  borderLeft: "5px solid #e36209",
  fontWeight: 100,
};

function noop() {}
const per_page = 20;

const FilterLink = (props) => {
  // const { sort, order, query, lang, page } = props;
  const doSearch = useCallback(() => {
    const { query, sort, order, lang, page, per_page } = props;

    let queryData = {};
    // let t = "?";
    if (query) {
      queryData.query = query;
    }
    if (sort) {
      queryData.sort = sort;
    }
    if (order) {
      queryData.order = order;
    }
    if (lang) {
      queryData.lang = lang;
    }
    if (page) {
      queryData.page = page;
    }
    if (page) {
      queryData.per_page = per_page;
    }

    // if (isValidElement(name)) {
    //   query.name = ''
    //   queryData = {query,name,sort, order,  lang, page}
    // } else {
    //   queryData = {query,name,sort, order,  lang, page}

    // }
    Router.push({
      pathname: "/search",
      query: queryData,
    });
    // return queryStr;
  }, []);
  // return <Link href={doSearch}>{querys.name}</Link>;
  return isValidElement(props.name) ? (
    <div onClick={doSearch}>{props.name}</div>
  ) : (
    <a href="#!" onClick={doSearch}>
      {props.name}
    </a>
  );
};
function Search({ router, repos }) {
  const { sort, order, query, lang, page } = router.query;
  // console.log("query", sort, order, query, lang, page);
  // console.log("repos", repos);
  useEffect(() => {
    if (!isServer) {
      cacheRepos(repos.items);
    }
  });
  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGES}
            renderItem={(name) => {
              const selected = lang === name;
              return (
                <List.Item key={name} style={selected ? selectedItemsStyle : null}>
                  <FilterLink name={name} lang={name} order={order} query={query} sort={sort} page={page} />
                </List.Item>
              );
            }}
          ></List>

          <List
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem={(item) => {
              let selected = false;
              if (item.name === SORT_TYPES[0].name && !sort) {
                selected = true;
              } else if (item.value === sort && item.order === order) {
                selected = true;
              }
              return (
                <List.Item key={item.name} style={selected ? selectedItemsStyle : null}>
                  <FilterLink lang={lang} order={item.order} name={item.name} query={query} sort={item.value} page={page} per_page={per_page} />
                </List.Item>
              );
            }}
          ></List>
        </Col>
        <Col span={14}>
          <h3 className="repos-title">{repos.total_count} 个仓库</h3>
          {repos.items.map((repo) => {
            return <Repo key={repo.id} repo={repo} />;
          })}
          <Pagination
            pageSize={per_page}
            current={Number(page) || 1}
            total={repos.total_count > 1000 ? 1000 : repos.total_count}
            onChange={noop}
            itemRender={(page, type, ol) => {
              const p = type === "page" ? page : type === "prev" ? page - 1 : page + 1;
              let name = type === "page" ? page : ol;

              return <FilterLink order={order} query={query} sort={sort} lang={lang} name={name} page={p} per_page={per_page} />;
            }}
          />
        </Col>
      </Row>
      <style jsx>
        {`
          .repos-title {
            border-bottom: 1px solid #eee;
            font-size: 24px;
            line-height: 50px;
          }
          .antd-pagination {
            padding: 20px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page, per_page } = ctx.query;
  let repos = { total_count: 0, items: [] };
  if (!ctx.query) {
    return { repos };
  }

  let queryString = `?q=${query}`;
  if (lang) {
    queryString += `+language:${lang}`;
  }
  if (sort) {
    queryString += `&sort=${sort}&order=${order || "desc"}`;
  }
  if (page) {
    queryString += `&page=${page}&per_page=${per_page}`;
  }
  console.log("queryString------------------", queryString);
  try {
    const reposResult = await request(
      {
        url: `${apis.search_repositories}${queryString}`,
      },
      ctx.req,
      ctx.res
    );
    // console.log("resultresultresult", reposResult.data);
    if (reposResult.status === 200) {
      repos = reposResult.data;
    }
  } catch (error) {
    console.log("search error");
  }
  return {
    repos,
  };
};
export default withRouter(Search);
