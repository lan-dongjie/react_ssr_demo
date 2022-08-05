import Router from "next/router";
import getConfig from "next/config";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "antd";
// import Layout from "../components/Layout";

const { publicRuntimeConfig } = getConfig();

const events = ["routeChangeStart", "routeChangeComplete", "routeChangeError", "beforeHistoryChange", "hashChangeStart", "hashChangeComplete"];

function makeEvent(type) {
  return (...args) => {
    console.log(type, ...args);
  };
}
events.forEach((type) => {
  Router.events.on(type, makeEvent(type));
});

function page() {
  const [isLogin, setLoginState] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    axios.get("/api/user/info").then((res) => {
      if (res.status === 200) {
        setLoginState(true);

        setName(res.data.name);
      } else {
        setLoginState(false);
        setName("");
      }
    });
  }, [isLogin, name]);
  return (
    <>
      {!isLogin ? (
        <p>
          <a href={publicRuntimeConfig.github.oauth_url}>
            <Button>GitHub 登录</Button>
          </a>
          <a href={publicRuntimeConfig.gitee.oauth_url}>
            <Button>Gitee 登录</Button>
          </a>
        </p>
      ) : (
        <p>welcome {name}</p>
      )}
    </>
  );
}

export default page;
