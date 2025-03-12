import { Module } from '@nestjs/common';
import { UserController } from '@/controller/user.controller';
import { PasswordService } from '@/utils/PasswordService';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PasswordService],
})
export class AppModule {}
