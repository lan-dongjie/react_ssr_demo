const Redis = require("ioredis");

const redis = new Redis({
  port: 6379,
});


function getKeys() {

  await redis.set('test',5, 123)
  const keys = await redis.keys("*");
  await redis.get('test')
}
getKeys()