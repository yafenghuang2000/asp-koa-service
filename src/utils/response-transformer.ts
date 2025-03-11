import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { Response } from 'express';

interface ResponseTransformer<T> {
  code: number;
  message: string;
  data: T;
}

export function BaseTransformResponse<T extends object, V>(cls: ClassConstructor<T>, data: V): T {
  return plainToClass<T, V>(cls, data, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
}

@Injectable()
// 实现NestInterceptor接口的intercept方法，用于拦截请求和响应
export class ResponseTransformerInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    const dtoClass = this.getDtoClassFromContext(context); // 获取DTO类

    return next.handle().pipe(
      map((data: T) => {
        response.status(HttpStatus.OK); // 设置 HTTP 状态码为 200
        // 处理成功响应
        return {
          code: 0, // 成功状态码统一为 0
          message: 'success', // 默认成功信息
          data:
            dtoClass && data
              ? BaseTransformResponse(dtoClass as ClassConstructor<object>, data)
              : (data ?? null), // 如果有 DTO 类，则转换数据，否则直接返回数据
        } as ResponseTransformer<T>;
      }),
      catchError((error: unknown) => {
        let message: string;
        let code: number;
        let statusCode: number = HttpStatus.OK;
        if (error instanceof HttpException) {
          const response = error.getResponse();
          if (typeof response === 'object' && response !== null) {
            const { code: errorCode, message: errorMessage } = response as {
              code?: number;
              message?: string;
            };
            message = errorMessage || error.message || '服务错误';
            code = errorCode ?? 9000;
          } else {
            message = error.message || '服务错误';
            code = 9000;
          }
          statusCode = error.getStatus(); // 使用原始异常的状态码
        } else {
          message = '服务错误';
          code = 9000;
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR; // 非HttpException异常，设置为500
        }
        return throwError(
          () =>
            new HttpException(
              {
                code,
                message,
                data: null,
              },
              statusCode, // 使用动态状态码
            ),
        );
      }),
    );
  }

  private getDtoClassFromContext(context: ExecutionContext): ClassConstructor<unknown> | undefined {
    const handler = context.getHandler();
    return Reflect.getMetadata('dtoClass', handler) as ClassConstructor<unknown> | undefined;
  }
}
