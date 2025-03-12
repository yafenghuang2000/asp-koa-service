import { Body, Controller, Post, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { PasswordService } from '@/utils/PasswordService';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '@/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly passwordService: PasswordService) {}
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({
    description: '登录请求体',
    type: LoginDto,
  })
  @Reflect.metadata('dtoClass', LoginResponseDto) // 确保这行代码存在
  async login(@Body() body: LoginDto) {
    const hashedPassword = await this.passwordService.hashPassword(body.password);
    const isMatch = await this.passwordService.comparePassword(body.password, hashedPassword);
    if (!isMatch) {
      throw new InternalServerErrorException('密码错误');
    }
    return { username: 'admin', token: '1234567890' };
  }
}
