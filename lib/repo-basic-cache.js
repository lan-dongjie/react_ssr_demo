import LRU from "lru-cache";

const REPO_CACHE = new LRU({
  maxAge: 1000 * 60 * 60,
  max: 500,
  ttl: 1000 * 60 * 60,
  maxSize: 5000,
  ttlAutopurge: false,
});

export function cacheRepo(repo) {
  console.log("repo", repo);
  REPO_CACHE.set(repo.full_name, repo);
}

export function getCacheRepo(full_name) {
  return REPO_CACHE.get(full_name);
}

export function cacheRepos(repos) {
  if (repos && Array.isArray(repos)) {
    repos.forEach((repo) => {
      cacheRepo(repo);
    });
  }
}
