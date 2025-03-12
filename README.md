import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

/**
 * 登录请求体
 */
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户名',
    required: true,
    example: 'admin',
  })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '密码',
    required: true,
    example: '123456admin',
  })
  password!: string;
}

/**
 * 登录响应体
 */
export class LoginResponseDto {
  @ApiProperty({ description: '用户名' })
  @Expose()
  username: string;

  @ApiProperty({ description: 'token' })
  @Expose()
  token: string;
}

/**
 * 注册请求体
 */
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户名',
    required: true,
    example: 'admin',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '密码',
    required: true,
    example: '123456admin',
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '手机号码',
    required: true,
    example: '15512341234',
  })
  mobile_number?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: '邮箱',
    required: true,
    example: '15512341234@qq.com',
  })
  email: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   type: String,
  //   description: '用户ID',
  //   required: false,
  //   example: '1',
  // })
  // user_id?: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   type: String,
  //   description: '用户类型',
  //   required: false,
  //   example: 'admin',
  // })
  // user_type?: string;

  // @IsOptional()
  // @ApiProperty({
  //   type: Number,
  //   description: '状态',
  //   required: false,
  //   example: true,
  // })
  // status?: boolean;

  // @IsOptional()
  // @ApiProperty({
  //   type: String,
  //   description: '角色',
  //   required: false,
  //   example: 'admin',
  // })
  // role?: string;

  // @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => String)
  // @ApiProperty({
  //   type: [String],
  //   description: '权限',
  //   required: false,
  //   example: ['admin'],
  // })
  // permission?: string[];
}

/**
 * 注册响应体
 */
export class RegisterResponseDto {
  @ApiProperty({ description: '用户名' })
  @Expose()
  username: string;
}
