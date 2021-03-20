import { BadGatewayException, BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({ status: 'ok', data })),
      catchError(err => {
        if (err.status == 400) {
          return throwError(err)
        } else if (err.error) {
          return throwError(new BadRequestException(err.message))
        }

        return throwError(new BadGatewayException(err.message))
      })
    );
  }
}
