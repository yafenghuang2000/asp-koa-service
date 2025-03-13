import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuClosureEntity, MenuEntity } from '@/entity/men.entity';
import { MenuService } from '@/service/menu.service';
import { MenuController } from '@/controller/menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, MenuClosureEntity])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
