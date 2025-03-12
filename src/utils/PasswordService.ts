import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  // 加密密码
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // 盐值轮数，推荐值为10
    return await bcrypt.hash(password, saltRounds);
  }

  // 验证密码
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
