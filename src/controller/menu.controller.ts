import { Body, Controller, Post, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MenuService } from 'src/service/menu.service';
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
    status: 200,
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
}
