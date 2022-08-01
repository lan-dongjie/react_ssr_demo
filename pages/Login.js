import axios from "axios";
import { Button } from "antd";
import getConfig from "next/config";
import { withRouter } from "next/router";
import { useEffect, useCallback } from "react";
import { GithubOutlined, WechatOutlined, QqOutlined } from "@ant-design/icons";
import GiteeIcon from "../components/Icons/Gitee";

const { publicRuntimeConfig } = getConfig();

export default withRouter(({ router }) => {
  const handleGotoOAuth = useCallback((oAuthType) => {
    axios
      .get(`/prepare-auth?url=${router.asPath}`)
      .then((resp) => {
        if (resp.status === 200) {
          location.href = publicRuntimeConfig[oAuthType].oauth_url;
        } else {
          console.log("prepare-auth err", resp);
        }
      })
      .catch((err) => {
        console.log("prepare-auth err", err);
      });
  }, []);
  const handleGotoGiteeOAuth = useCallback(() => {
    handleGotoOAuth("gitee");
  }, [handleGotoOAuth]);

  const handleGotoGithubOAuth = useCallback(() => {
    handleGotoOAuth("github");
  }, [handleGotoOAuth]);
  return (
    <div>
      <p>使用第三方登录</p>
      <Button onClick={handleGotoGiteeOAuth}>
        <GiteeIcon style={{ color: "#C71D23" }} />
      </Button>
      <Button onClick={handleGotoGithubOAuth}>
        <GithubOutlined style={{ color: "#24292F" }} />
      </Button>
      <Button>
        <WechatOutlined />
      </Button>
      <Button>
        <QqOutlined />
      </Button>
    </div>
  );
});
