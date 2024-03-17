import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common"


/**
 * Cria um decorador de parâmetro para obter o ID do parâmetro da solicitação HTTP.
 * @param {string} _data - Dados opcionais para o decorador (não utilizado neste caso).
 * @param {ExecutionContext} context - Contexto de execução do NestJS.
 * @returns {number} O ID do parâmetro da solicitação HTTP.
 */
export const User = createParamDecorator((_data: string, context: ExecutionContext) => {

    const request = context.switchToHttp().getRequest();

    if (request.user) {
        if (_data) {
            return request.user[_data];

        } else {
            return request.user

        }
    } else {
        throw new NotFoundException("Usuário não encontrado no Request. Use o AuthGuard para obter o usuário.")
    }

});