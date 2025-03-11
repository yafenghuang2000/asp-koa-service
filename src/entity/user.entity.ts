import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import dayjs from 'dayjs';

type DateType = string | number | Date;

/**
 * 用户实体类
 * 用于映射数据库中的用户表
 */
@Entity('user_info')
export class UserEntity {
  /**
   * 主键，由数据库自动生成
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户名，唯一且不能为空
   */
  @Column({ unique: true, nullable: false })
  username: string;

  /**
   * 密码，不能为空
   */
  @Column({ nullable: false })
  password: string;

  /**
   * 手机号码，允许为空
   */
  @Column({ nullable: true })
  mobile_number: string;

  /**
   * 邮箱，唯一且不能为空
   */
  @Column({ unique: true, nullable: false })
  email: string;

  /**
   * 用户ID，允许为空
   */
  @Column({ nullable: true })
  user_id: string;

  /**
   * 用户类型，允许为空
   */
  @Column({ nullable: true })
  user_type: string;

  /**
   * 状态，允许为空
   */
  @Column({ type: 'tinyint', default: 0, nullable: true })
  status: number;

  /**
   * 角色，允许为空
   */
  @Column({ type: 'mediumtext', nullable: true })
  role: string;

  /**
   * 权限，允许为空
   */
  @Column({ type: 'mediumtext', nullable: true })
  permission: string;

  /**
   * 创建时间，由数据库自动生成
   */
  @CreateDateColumn()
  @Transform(({ value }) => {
    return dayjs(value as DateType).format('YYYY-MM-DD HH:mm:ss');
  })
  createdAt: Date;

  /**
   * 更新时间，由数据库自动生成
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
