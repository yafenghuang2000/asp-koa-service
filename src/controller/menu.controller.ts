import { Body, Get, Controller, Post, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MenuService } from '@/service/menu.service';
import { MenuEntity } from '@/entity/men.entity';
import { CreateMenuDto } from '@/dto/men.dto';

@ApiTags('菜单管理')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post('create')
  @ApiOperation({ summary: '新增菜单项' })
  @ApiBody({
    description: '新增菜单请求体',
    type: CreateMenuDto,
  })
  @ApiResponse({
    description: '新增菜单成功',
    type: 'string',
  })
  public async createMenu(@Body() createMenuDto: CreateMenuDto): Promise<string> {
    try {
      return await this.menuService.createMenu(createMenuDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('queryAll')
  @ApiOperation({ summary: '查询所有菜单项' })
  @ApiResponse({
    description: '查询所有菜单请求体',
    type: MenuEntity,
  })
  public async findAll(): Promise<MenuEntity[]> {
    try {
      return await this.menuService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
