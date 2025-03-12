import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import RedisCache from '@/utils/redisCache';
import { LoginDto, LoginResponseDto } from '@/dto/user.dto';
import { UserEntity } from '@/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService, // 明确类型
  ) {}

  login = async (loginDto: LoginDto): Promise<LoginResponseDto> => {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
        username: user.username,
        timestamp: new Date().getTime(),
      },
      { expiresIn: '1h', secret: process.env.JWT_SECRET as string },
    );

    const redisKey = `user:${user.username}`;
    // 如果缓存不存在，设置缓存
    const redisSet = await RedisCache.set(redisKey, token, 60 * 60);
    const getRedis = await RedisCache.get(redisKey);
    if (!redisSet) {
      throw new BadRequestException('设置 Redis 缓存失败');
    }

    return {
      username: user.username,
      token: JSON.stringify(getRedis),
    };
  };
}
