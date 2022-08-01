const axios = require("axios");
const config = require("../config");

const isServer = typeof window === "undefined";

async function requestGitData(method, url, data, headers) {
  return await axios({
    method,
    url,
    data,
    headers,
  });
}

async function request({ method = "GET", url, data = {} }, req, res) {
  if (isServer) {
    console.log("req", req);
    const session = req.session;
    const { authType, Auth } = session;
    const headers = {};
    if (Auth) {
      const { token_type, access_token } = Auth;
      headers["Authorization"] = `${token_type} ${access_token}`;
    }
    const { base_api } = config[authType];
    return await requestGitData(method, `${base_api}${url}`, data, headers);
  } else {
    return await axios({
      method,
      url,
      data,
      headers,
    });
  }
}

module.exports = {
  request,
  requestGitData,
};
