import { Body, Controller, Post, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '@/dto/user.dto';
import { UserService } from '@/service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly useService: UserService) {}
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({
    description: '登录请求体',
    type: LoginDto,
  })
  @Reflect.metadata('dtoClass', LoginResponseDto) // 确保这行代码存在
  async login(@Body() body: LoginDto) {
    try {
      const result = await this.useService.login(body);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('register')
  @ApiOperation({ summary: '注册用户' })
  @ApiBody({
    description: '注册用户请求体',
    type: RegisterDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const savedUser = await this.useService.register(registerDto);
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
