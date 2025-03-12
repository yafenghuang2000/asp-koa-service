import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
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
  database: process.env.MYSQL_DATABASE,
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
      entities: [path.join(__dirname, '../../entity/**/*.entity{.ts,.js}')],
      synchronize: true,
      poolSize: 300,
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule implements OnModuleInit {
  constructor(private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      if (this.connection && !this.connection.isConnected) {
        await this.connection.connect();
        console.log('MySQL数据库连接成功:localhost:3306');
      } else {
        console.log('MySQL数据库已连接:localhost:3306');
      }
    } catch (error) {
      console.error('MySQL数据库连接失败:localhost:3306', error);
    }
  }
}

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
