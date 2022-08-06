const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

const isServer = typeof window === "undefined";

dayjs.extend(relativeTime);
function getLastUpdated(time) {
  return dayjs(time).fromNow();
}

module.exports = {
  isServer,
  getLastUpdated,
};
