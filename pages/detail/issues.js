import React, { useState, useCallback, useEffect } from "react";
import { Avatar, Button, Select, Spin } from "antd";
import dynamic from "next/dynamic";
import withRepoBasic from "../../components/with-repo-basic";
import { getLastUpdated, isServer } from "../../utils/util";
import SearchUser from "../../components/SearchUser";
import { apis } from "../../lib/apis";
import { request } from "../../lib/request";

const MdRenderer = dynamic(() => import("../../components/MarkdownRender"));

const CACHE = {};

function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MdRenderer content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          打开Issue讨论页面
        </Button>
      </div>
      <style jsx>{`
        .root {
          background: #fefefe;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  );
}

function IssueItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false);

  const toggleShowDetail = useCallback(() => {
    setShowDetail((detail) => !detail);
  }, []);

  return (
    <>
      <div className="issue">
        <div className="avatar">
          <Button type="primary" size="small" style={{ position: "absolute", right: 10, top: 10 }} onClick={toggleShowDetail}>
            {showDetail ? "隐藏" : "查看"}
          </Button>
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {issue.labels.map((label) => (
              <Label label={label} key={label.id} />
            ))}
          </h6>
          <p className="sub-info">
            <span>Updated at {getLastUpdated(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            padding-right: 40px;
            font-size: 16px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
    </>
  );
}

function makeQuery(creator, state, labels) {
  let creatorStr = creator ? `creator=${creator}` : "";
  let stateStr = state ? `state=${state}` : "";
  let labelStr = "";
  if (labels && labels.length > 0) {
    labelStr = `labels=${labels.join(",")}`;
  }

  const arr = [];
  if (creatorStr) arr.push(creatorStr);
  if (stateStr) arr.push(stateStr);
  if (labelStr) arr.push(labelStr);

  return `?${arr.join("&")}`;
}

function Label({ label }) {
  return (
    <>
      <span className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px 10px;
          border-radius: 5px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}

const { Option } = Select;
const Issues = ({ initialIssues, labels, owner, name }) => {
  console.log("initialIssues", initialIssues);
  console.log("labels", labels);
  const [creator, setCreator] = useState();
  const [states, setStates] = useState();
  const [issues, setIssues] = useState(initialIssues);
  const [label, setLabel] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    // 缓存获取的labels
    if (!isServer) CACHE[`${owner}/${name}`] = labels;
  }, [labels, owner, name]);

  const handleCreatorChange = useCallback((value) => {
    setCreator(value);
  }, []);
  const handleStateChange = useCallback((value) => {
    setStates(value);
  }, []);
  const handleLabelChange = useCallback((value) => {
    setLabel(value);
  }, []);

  const handleSearch = useCallback(() => {
    // search
    setFetching(true);
    request({
      url: `/repos/${owner}/${name}/issues${makeQuery(creator, states, label)}`,
    })
      .then((resp) => {
        setIssues(resp.data);
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, []);
  return (
    <div className="root">
      <div className="search">
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select placeholder="状态" onChange={handleStateChange} value={states} style={{ width: 200, marginLeft: 20 }}>
          <Option value="all">all</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>
        <Select placeholder="Label" onChange={handleLabelChange} style={{ flexGrow: 1, width: 200, marginLeft: 20, marginRight: 20 }} mode="multiple">
          {labels.map((la) => (
            <Option value={la.name} key={la.id}>
              {la.name}
            </Option>
          ))}
          <Option value="closed">closed</Option>
        </Select>
        <Button type="primary" disabled={fetching} onClick={handleSearch}>
          搜索
        </Button>
      </div>
      {fetching ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div className="issues">
          {issues.map((issue) => (
            <IssueItem issue={issue} key={issue.id} />
          ))}
        </div>
      )}

      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin-top: 20px;
        }
        .search {
          display: 20px;
        }
        .loading {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

// 在高级组件中被调用，返回的参数，在返回给被包裹的组件
Issues.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query;
  const full_name = `${owner}/${name}`;
  const fetchs = await Promise.all([
    await request(
      {
        url: `${apis.repos_detail}/${owner}/${name}/issues`,
      },
      ctx
    ),
    CACHE[full_name]
      ? Promise.resolve({ data: CACHE[full_name] })
      : await request(
          {
            url: `${apis.repos_detail}/${owner}/${name}/labels`,
          },
          ctx
        ),
  ]);

  return {
    owner,
    name,
    initialIssues: fetchs[0].data,
    labels: fetchs[1].data,
  };
};

export default withRepoBasic(Issues, "issues");
