import { Module } from '@nestjs/common';
import { PasswordService } from '@/utils/PasswordService';
import { UserController } from '@/controller/user.controller';
import { UserService } from '@/service/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PasswordService],
  exports: [UserService],
})
export class UserModule {}
