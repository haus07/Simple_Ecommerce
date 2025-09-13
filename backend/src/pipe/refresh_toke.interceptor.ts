import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators'

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor{
    

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const response = context.switchToHttp().getResponse()

        return next.handle().pipe(
            tap((data) => {
                const refreshToken = data.refreshToken
                response.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge:  7 * 24 * 60 * 60 * 1000
                })
            })
        )
    }
}