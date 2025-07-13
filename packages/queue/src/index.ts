import Redis from "ioredis";

let redisInstance: Redis | null = null;

function getRedisInstance() {
  if (!redisInstance) {
    redisInstance = new Redis({ host: 'localhost' });
  }
  return redisInstance;
}

export default getRedisInstance();