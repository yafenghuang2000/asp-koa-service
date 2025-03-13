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
   * @param createMenuDto 包含菜单项信息的DTO对象
   * @returns 返回操作成功的消息
   * @throws ConflictException 如果菜单项已存在，则抛出冲突异常
   */
  public async createMenu(createMenuDto: CreateMenuDto): Promise<string> {
    const { id, label, path, parentId } = createMenuDto;

    if (!id) {
      throw new ConflictException('节点id不能为空');
    }

    if (!label) {
      throw new ConflictException('节点名称不能为空');
    }

    // 检查节点是否已存在
    const existingMenu = await this.menuRepository.findOne({ where: { id } });
    if (existingMenu) {
      throw new ConflictException('节点已存在，无法重复添加');
    }

    // 1. 插入菜单项
    const menu = new MenuEntity();
    menu.id = id;
    menu.label = label;
    menu.path = path;
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

  /**
   * 查询所有菜单项并构建树形结构
   * @returns 返回树形结构的菜单项数组
   */
  public async findAll(): Promise<MenuEntity[]> {
    // 查询所有菜单项
    const menus = await this.menuRepository.find();

    // 查询所有层级关系
    const closures = await this.menuClosureRepository.find();

    // 构建树形结构
    return this.buildTree(menus, closures);
  }

  /**
   * 将扁平化的菜单数据转换为树形结构
   * @param menus 菜单项数组
   * @param closures 层级关系数组
   * @returns 返回树形结构的菜单项数组
   */
  private buildTree(menus: MenuEntity[], closures: MenuClosureEntity[]): MenuEntity[] {
    const menuMap = new Map<string, MenuEntity>();
    const roots: MenuEntity[] = [];

    // 将所有菜单项存入 Map
    menus.forEach((menu) => {
      menu.children = []; // 初始化子菜单数组
      menuMap.set(menu.id, menu);
    });

    // 构建树形结构
    closures.forEach((closure) => {
      if (closure.depth === 1) {
        // 如果深度为 1，表示是父子关系
        const parent = menuMap.get(closure.ancestor);
        const child = menuMap.get(closure.descendant);
        if (parent && child) {
          parent.children.push(child);
        }
      } else if (closure.depth === 0 && closure.ancestor === closure.descendant) {
        // 如果深度为 0，且 ancestor === descendant，表示是根节点
        const root = menuMap.get(closure.ancestor);
        if (root && !roots.includes(root)) {
          roots.push(root);
        }
      }
    });

    return roots;
  }
}
