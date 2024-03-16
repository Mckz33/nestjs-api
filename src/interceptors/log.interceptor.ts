import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class LogInterceptor implements NestInterceptor {

    /**
     * Interceptor para registrar informações sobre a execução das solicitações HTTP.
     * @param {ExecutionContext} context - O contexto de execução do NestJS.
     * @param {CallHandler<any>} next - O manipulador de chamadas para continuar a execução da solicitação.
     * @returns {Observable<any>} Um Observable que emite o resultado da execução da solicitação.
     */
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const dt = Date.now();
        return next.handle().pipe(tap(() => {
            const request = context.switchToHttp().getRequest();
            console.log(`URL: ${request.url}`);
            console.log(`URL: ${request.method}`);
            console.log(`Execução levou ${Date.now() - dt} milisegundos.`)
        }))
    }

}