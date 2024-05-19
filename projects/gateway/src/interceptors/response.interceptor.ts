import { Injectable } from '@nestjs/common'
import { catchError, map } from 'rxjs'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { responseSuccess } from '../utils/response'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(data => responseSuccess(data)),
      catchError(async (e) => {
        throw e
      }),
    )
  }
}
