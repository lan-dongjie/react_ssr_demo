const prefix = "/api/third_party";

const apis = {
  user_repos: `${prefix}/user/repos`,
  user_stared: `${prefix}/user/stared`,
  search_repositories: `${prefix}/search/repositories`,
  repos_detail: `${prefix}/repos`,
  search_user: `${prefix}/search/users`,
};

module.exports = { apis, prefix };
