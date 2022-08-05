import Link from "next/link";
import { StarOutlined } from "@ant-design/icons";
import moment from "moment";

function getLastUpdated(time) {
  return moment(time).fromNow();
}

function getLicense(license) {
  return license ? `${license.spdx_id} license` : "";
}

export default ({ repo }) => {
  return (
    <div className="root">
      <div className="basic-info">
        <h3 className="repo-title">
          <Link href={`/detail?owner=${repo.owner.login}&name=${repo.name}`}>{repo.name}</Link>
        </h3>
        <p className="repo-desc">{repo.description}</p>
        <p className="other-info">
          {repo.license ? <span className="license">{getLicense(repo.license)}</span> : null}
          <span className="last-updated">{getLastUpdated(repo.updated_at)}</span>
          <span className="open-issues">{repo.open_issues_count} open issues</span>
        </p>
        <div className="lang-start">
          <span className="lang">{repo.language}</span>
          <span className="start">
            {repo.stargazers_count}
            <StarOutlined />
          </span>
        </div>
      </div>
      <style jsx>
        {`
          .root + .root {
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .repo-title {
            font-size: 20px;
          }
          .lang-start {
            display: flex;
          }
          .lang {
            flex: 1;
          }
          .lang-start > span + span {
            margin-left: 10px;
            text-align: right;
          }
          .repo-desc {
            width: 400px;
          }
          .other-info > span + span {
            margin-left: 10px;
          }
        `}
      </style>
    </div>
  );
};
