import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public label: string;

  @IsOptional()
  @IsString()
  public path?: string;

  @IsOptional()
  @IsString()
  public parentId?: string; // 父节点ID，用于构建层级关系
}
