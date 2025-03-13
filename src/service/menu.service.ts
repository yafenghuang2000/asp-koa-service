import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuClosureEntity, MenuEntity } from '@/entity/men.entity';
import { CreateMenuDto } from '@/dto/men.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(MenuClosureEntity)
    private readonly menuClosureRepository: Repository<MenuClosureEntity>,
  ) {}
  /**
   * 新增菜单项
   */
  public async createMenu(createMenuDto: CreateMenuDto): Promise<string> {
    const { id, label, path, parentId } = createMenuDto;

    // 检查节点是否已存在
    const existingMenu = await this.menuRepository.findOne({ where: { id } });
    if (existingMenu) {
      throw new ConflictException('节点已存在，无法重复添加');
    }

    // 1. 插入菜单项
    const menu = new MenuEntity();
    menu.id = id;
    menu.label = label;
    menu.path = path || '';
    await this.menuRepository.save(menu);

    // 2. 插入层级关系
    if (parentId) {
      // 如果存在父节点，插入与父节点的关系
      const parentClosures = await this.menuClosureRepository.find({
        where: { descendant: parentId },
      });

      for (const closure of parentClosures) {
        const newClosure = new MenuClosureEntity();
        newClosure.ancestor = closure.ancestor;
        newClosure.descendant = id;
        newClosure.depth = closure.depth + 1;
        await this.menuClosureRepository.save(newClosure);
      }
    }

    // 插入自身的关系
    const selfClosure = new MenuClosureEntity();
    selfClosure.ancestor = id;
    selfClosure.descendant = id;
    selfClosure.depth = 0;
    await this.menuClosureRepository.save(selfClosure);
    return '菜单项新增成功';
  }
}
