import { Module } from '@nestjs/common';
import { UserController } from '@/controller/user.controller';
// import { UserController } from '@/controller/userController';
// import { UseService } from '@/service/useService';

@Module({
  controllers: [UserController],
  // providers数组用于定义该模块中包含的服务
  // UseService是用户相关的服务，提供业务逻辑处理
  providers: [],
  // exports数组用于定义该模块中需要导出的服务
  // 这样其他模块可以通过导入UserModule来使用UseService
  exports: [],
})
export class UserModule {}
