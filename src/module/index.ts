import { Module } from '@nestjs/common';
import { TypeOrmConfigModule, GlobalEntitiesModule, JwtGlobalModule } from './config.module';
import { UserController } from '@/controller/user.controller';

import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmConfigModule, GlobalEntitiesModule, JwtGlobalModule, UserModule],
  controllers: [UserController],
})
export class AppModule {}
