const axios = require("axios");
const config = require("../config");
const { isServer } = require("../utils/util");
const { prefix } = require("../lib/apis");

function requestGitData(method, url, data, params, headers) {
  // console.log("qqqqqqqqqq", method, url, data, headers);
  return axios({
    method,
    url,
    data,
    params,
    headers,
  });
}

function request(options, ctx) {
  const { method = "GET", url, data = {}, params = {} } = options;
  if (isServer) {
    const { session } = ctx;
    const { authType, Auth } = session;
    const headers = {};
    if (Auth) {
      const { token_type, access_token } = Auth;
      headers["Authorization"] = `${token_type} ${access_token}`;
      if (authType === "gitee") {
        params.access_token = access_token;
      }
    }
    console.log("authType", authType);
    const { base_api } = config[authType];
    return requestGitData(method, `${base_api}${url.replace(prefix, "")}`, data, params, headers);
  } else {
    return axios({
      method,
      url,
      data,
    });
  }
}

module.exports = {
  request,
  requestGitData,
};
