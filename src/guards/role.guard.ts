import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) { }

    /**
     * Determina se o usuário tem permissão para acessar o recurso com base nas funções requeridas.
     * @param {ExecutionContext} context - Contexto de execução da requisição.
     * @returns {Promise<boolean>} Promessa que resolve para true se o usuário tiver as funções requeridas, caso contrário, false.
     */
    async canActivate(context: ExecutionContext) {

        const requeridRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requeridRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const rolesFilted = requeridRoles.filter(role => role === user.role)
        return rolesFilted.length > 0

    }

}