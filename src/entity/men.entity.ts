import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * 菜单实体类
 * 用于映射数据库中的菜单表
 */
@Entity('menu')
export class MenuEntity {
  /**
   * 菜单ID，主键，使用 UUID 生成
   */
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  /**
   * 菜单名称，不能为空
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  public label: string;

  /**
   * 菜单路径，不能为空
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  public path: string;

  /**
   * 闭包关系（作为祖先节点）
   */
  @OneToMany(() => MenuClosureEntity, (closure) => closure.ancestorMenu)
  public ancestorClosures: MenuClosureEntity[];

  /**
   * 闭包关系（作为后代节点）
   */
  @OneToMany(() => MenuClosureEntity, (closure) => closure.descendantMenu)
  public descendantClosures: MenuClosureEntity[];
  public children: MenuEntity[];
}

/**
 * 菜单闭包实体类
 * 用于映射数据库中的菜单闭包表
 */
@Entity('menu_closure')
export class MenuClosureEntity {
  /**
   * 祖先节点ID，联合主键
   */
  @PrimaryColumn({ type: 'varchar', length: 36 })
  public ancestor: string;

  /**
   * 后代节点ID，联合主键
   */
  @PrimaryColumn({ type: 'varchar', length: 36 })
  public descendant: string;

  /**
   * 深度（祖先节点到后代节点的层级数）
   */
  @Column({ type: 'int', nullable: false })
  public depth: number;

  /**
   * 关联到祖先菜单项
   */
  @ManyToOne(() => MenuEntity, (menu) => menu.id)
  @JoinColumn({ name: 'ancestor' })
  public ancestorMenu: MenuEntity;

  /**
   * 关联到后代菜单项
   */
  @ManyToOne(() => MenuEntity, (menu) => menu.id)
  @JoinColumn({ name: 'descendant' })
  public descendantMenu: MenuEntity;
}
