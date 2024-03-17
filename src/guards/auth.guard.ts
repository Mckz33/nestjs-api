import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    /**
     * Determina se o usuário está autenticado e possui permissão para acessar o recurso.
     * @param {ExecutionContext} context - Contexto de execução da requisição.
     * @returns {Promise<boolean>} Promessa que resolve para true se o usuário estiver autenticado e tiver permissão, caso contrário, false.
     */
    async canActivate(context: ExecutionContext) {

        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;
        try {
            const data = this.authService.checkToken((authorization ?? '').split(' ')[1]);

            request.tokenPayload = data;

            request.user = await this.userService.findById(data.id);

            return true;

        } catch (error) {
            return false;
        }
    }

}