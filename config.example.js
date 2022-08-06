// 获取授权地址
const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const GITEE_OAUTH_URL = "https://gitee.com/oauth/authorize";
const REDIRECT_URL = "http://localhost:3000/auth";
// 需要的权限
const SCOPE = "user";

// 完整授权地址
const GITHUB_CLIENT_ID = "";
const GITHUB_CLIENT_SECRET = "";
const GITHUB_BASE_URL = "https://api.github.com";
const github = {
  user_info_url: "https://api.github.com/user",
  request_token_url: "https://github.com/login/oauth/access_token",
  client_id: GITHUB_CLIENT_ID,
  client_secret: GITHUB_CLIENT_SECRET,
  oauth_url: `${GITHUB_OAUTH_URL}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPE}`,
  getTokenPostData(code) {
    return {
      code,
      redirect_uri: REDIRECT_URL,
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
    };
  },
  base_api: GITHUB_BASE_URL,
  apis: {
    respositories: `${GITHUB_BASE_URL}/search/respositories`,
    user_repos: `${GITHUB_BASE_URL}/user/repos`,
  },
};

const GITEE_CLIENT_ID = "";
const GITEE_CLIENT_SECRET = "";
const GITEE_BASE_URL = "https://gitee.com/api/v5";
const gitee = {
  user_info_url: "https://gitee.com/api/v5/user",
  request_token_url: "https://gitee.com/oauth/token",
  client_id: GITEE_CLIENT_ID,
  client_secret: "",
  oauth_url: `${GITEE_OAUTH_URL}?client_id=${GITEE_CLIENT_ID}&redirect_uri=${REDIRECT_URL}?type=gitee&response_type=code`,
  getTokenPostData(code) {
    return {
      code,
      client_id: GITEE_CLIENT_ID,
      grant_type: "authorization_code",
      client_secret: GITEE_CLIENT_SECRET,
      redirect_uri: `${REDIRECT_URL}?type=gitee`,
    };
  },
  base_api: GITEE_BASE_URL,
};

module.exports = {
  gitee,
  github,
};
