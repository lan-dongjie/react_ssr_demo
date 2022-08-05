import LRU from "lru-cache";

const REPO_CACHE = new LRU({
  maxAge: 1000 * 60 * 60,
});

export function cacheRepo(repo) {
  REPO_CACHE.set(repo.full_name, repo);
}

export function getCacheRepo(full_name) {
  return REPO_CACHE.get(full_name);
}

export function cacheRepos(repos) {
  repos.forEach((repo) => {
    cacheRepo(repo);
  });
}
