import { Global, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';
import * as process from 'node:process';
import * as path from 'path';
import { UserEntity } from '@/entity/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [TypeOrmModule],
})
export class GlobalEntitiesModule {}

// 从环境变量获取 Redis 配置，若未设置则使用默认值
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
});

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: redisClient,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}

const MysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || '123456789',
  database: process.env.MYSQL_DATABASE || 'my-test',
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MysqlConfig.host,
      port: MysqlConfig.port,
      username: MysqlConfig.username,
      password: MysqlConfig.password,
      database: MysqlConfig.database,
      entities: [path.join(__dirname, '../entity/**/*.entity{.ts,.js}')],
      synchronize: true,
      poolSize: 300,
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        console.log(`MySQL数据库连接成功:${MysqlConfig.host}:${MysqlConfig.port}`);
      } else {
        console.log(`MySQL数据库已连接:${MysqlConfig.host}:${MysqlConfig.port}`);
      }
    } catch (error) {
      console.error(`MySQL数据库连接失败:${MysqlConfig.host}:${MysqlConfig.port}`, error);
    }
  }
}
