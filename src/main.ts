import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './module';
import { ResponseTransformerInterceptor } from './utils/response-transformer';
import 'reflect-metadata';

// 根据环境变量加载对应的 .env 文件
// 根据环境变量加载对应的 .env 文件
const env = process.env.NODE_ENV || 'production';
(dotenv as { config: (options: { path: string }) => void }).config({ path: `.env.${env}` });

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ResponseTransformerInterceptor());
    const config = new DocumentBuilder()
      .setTitle('API 文档')
      .setDescription('API 描述')
      .setVersion('1.0')
      .addTag('api')
      // 添加 JWT 认证配置
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    const prompt = process.env.SERVICE_PORT ?? 3000;
    await app.listen(prompt);
    console.log(`asp-nest-service服务启动成功:${prompt ?? 3000}`);
  } catch (error) {
    console.log(
      `asp-nest-service服务启动失败:${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
void bootstrap();
