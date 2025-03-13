import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { TypeOrmConfigModule, GlobalEntitiesModule } from './db.config.module';
import { JwtGlobalModule } from './jwt.config.module';
import { UserController } from '@/controller/user.controller';
import { UserModule } from './user.module';
import { MenuModule } from './menu.module';

@Module({
  imports: [TypeOrmConfigModule, GlobalEntitiesModule, JwtGlobalModule, UserModule, MenuModule],
  controllers: [UserController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthenticationGuard,
    // },
  ],
})
export class AppModule {}
