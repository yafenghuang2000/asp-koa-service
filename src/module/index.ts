import { Module } from '@nestjs/common';
import { TypeOrmConfigModule, GlobalEntitiesModule } from './db.config.module';
import { JwtGlobalModule } from './jwt.config.module';
import { UserController } from '@/controller/user.controller';
import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmConfigModule, GlobalEntitiesModule, JwtGlobalModule, UserModule],
  controllers: [UserController],
})
export class AppModule {}
