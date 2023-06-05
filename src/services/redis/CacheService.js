// eslint-disable-next-line import/no-extraneous-dependencies
const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      socket: {
        host: config.redis.server,
      },
    });

    this.client.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
    this.client.connect();
  }

  async set(key, value, expirationInSecond = 30000) {
    await this.client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this.client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  delete(key) {
    return this.client.del(key);
  }
}

module.exports = CacheService;
