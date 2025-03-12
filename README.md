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





import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
{
ignores: ['eslint.config.mjs'],
},
eslint.configs.recommended,
...tseslint.configs.recommendedTypeChecked,
eslintPluginPrettierRecommended,
{
languageOptions: {
globals: {
...globals.browser,
...globals.es2020,
...globals.node,
},
ecmaVersion: 5,
sourceType: 'module',
parserOptions: {
projectService: true,
tsconfigRootDir: import.meta.dirname,
},
},
settings: {
react: {
version: 'detect',
},
'import/resolver': {
typescript: {
alwaysTryTypes: true,
project: './tsconfig.json',
},
alias: {
map: [
['@', './src'], // 假设你的项目中 '@' 别名指向 'src' 目录
],
extensions: ['.js', '.jsx', '.ts', '.tsx'],
},
},
},
plugins: {
import: importPlugin,
prettier,
'@typescript-eslint': tseslint,
},
},
{
rules: {
'@typescript-eslint/no-explicit-any': 'error',
'@typescript-eslint/no-floating-promises': 'warn',
'@typescript-eslint/no-unsafe-argument': 'warn',
camelcase: [
'error',
{
properties: 'never',
ignoreDestructuring: true,
},
],
'@typescript-eslint/naming-convention': [
'error',
{
selector: 'interface',
format: ['PascalCase'],
prefix: ['I'],
},
{
selector: 'class',
format: ['PascalCase'],
},
{
selector: 'typeAlias',
format: ['PascalCase'],
},
{
selector: 'enum',
format: ['PascalCase'],
},
],
// 代码风格
indent: ['error', 2, { SwitchCase: 1 }],
quotes: ['error', 'single'],
semi: ['error', 'always'],
'comma-dangle': ['error', 'always-multiline'],
'max-lines': ['error', { max: 300 }],
'max-len': [
'error',
{
code: 100,
ignoreStrings: true,
ignoreTemplateLiterals: true,
ignoreComments: true,
},
],
// 导入规则
'import/order': [
'error',
{
groups: ['external', 'internal'],
'newlines-between': 'never',
// alphabetize: false,
},
],

      'no-console': ['warn', { allow: ['log', 'warn'] }],
      'no-debugger': 'warn',
      'no-unused-vars': 'off', // 使用 TypeScript 的规则替代
      'prefer-const': 'error',
      'no-var': 'error',

      // 最佳实践
      eqeqeq: ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      // 'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: true }],
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'no-param-reassign': 'error',

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^React$',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      ...prettier.configs.recommended.rules, //禁用与 Prettier 冲突的 ESLint 规则
      // ...tseslint.configs.recommended.rules, //检查 TypeScript 代码是否符合最佳实践
    },
},
);
