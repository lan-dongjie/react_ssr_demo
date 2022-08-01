function getRedisSessionId(sid) {
  return `ssid: ${sid}`;
}

class RedisSessionStore {
  constructor(client) {
    this.client = client;
  }
  /**
   * 获取Redis中的session数据
   * @param {string} sid session id
   */
  async get(sid) {
    const id = getRedisSessionId(sid);
    const data = await this.client.get(id);
    if (!data) {
      return null;
    }
    try {
      const result = JSON.parse(data);
      return result;
    } catch (error) {}
  }

  /**
   * 把session数据存储到Redis中
   * @param {string} sid session id
   * @param {string} sess session 数据
   * @param {string} ttl 超时时间
   */
  async set(sid, sess, ttl) {
    const id = getRedisSessionId(sid);
    if (typeof ttl === "number") {
      ttl = Math.ceil(ttl / 1000);
    }
    try {
      const sessStr = JSON.stringify(sess);
      if (ttl) {
        await this.client.setex(id, ttl, sessStr);
      } else {
        await this.client.set(id, sessStr);
      }
    } catch (error) {}
  }
  /**
   * 从Redis删除某个session
   * @param {string} sid session id
   */
  async destroy(sid) {
    const id = getRedisSessionId(sid);

    await this.client.del(id);
  }
}

module.exports = RedisSessionStore;
