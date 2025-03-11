import { Body, Controller, Post, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '@/dto/user.dto';

@Controller('user')
export class UserController {
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({
    description: '登录请求体',
    type: LoginDto,
  })
  @Reflect.metadata('dtoClass', LoginResponseDto) // 确保这行代码存在
  login(@Body() body: LoginDto) {
    try {
      console.log(body, 'body');
      const metadata = Reflect.getMetadata('dtoClass', UserController.prototype.login);
      console.log('Metadata:', metadata);
      return { username: 'admin', token: '1234567890' };
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
