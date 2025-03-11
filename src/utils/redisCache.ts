import Redis from 'ioredis';

class RedisCache {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('connect', () => {
      const host = this.client.options.host;
      const port = this.client.options.port;
      console.log(`Redis 连接成功:${host}:${port}`);
    });

    this.client.on('error', (err) => {
      const host = this.client.options.host;
      const port = this.client.options.port;
      console.log(`Redis 连接失败:${host}:${port}`, err);
    });
  }

  //设置缓存
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await this.client.set(key, JSON.stringify(value), 'EX', ttl);
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
      return true; // 返回 true 表示缓存成功
    } catch (error) {
      console.error('Failed to set value in Redis:', error);
      return false; // 返回 false 表示缓存失败
    }
  }

  //获取缓存
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error('Failed to get value from Redis:', error);
      return null;
    }
  }

  //检查缓存是否存在
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1; // 返回 true 表示键存在
    } catch (error) {
      console.error('Failed to check if key exists in Redis:', error);
      return false; // 返回 false 表示检查失败或键不存在
    }
  }

  //更新缓存过期时间
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      await this.client.expire(key, ttl);
      return true; // 返回 true 表示更新过期时间成功
    } catch (error) {
      console.error('Failed to update expiration time in Redis:', error);
      return false; // 返回 false 表示更新过期时间失败
    }
  }

  //删除缓存
  async delete(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true; // 返回 true 表示删除成功
    } catch (error) {
      console.error('Failed to delete value from Redis:', error);
      return false; // 返回 false 表示删除失败
    }
  }

  //清除所有缓存
  async clear(): Promise<boolean> {
    try {
      await this.client.flushall();
      return true; // 返回 true 表示清除成功
    } catch (error) {
      console.error('Failed to clear Redis:', error);
      return false; // 返回 false 表示清除失败
    }
  }
}

export default new RedisCache();
