import { ExecutionContext, createParamDecorator } from "@nestjs/common"


/**
 * Cria um decorador de parâmetro para obter o ID do parâmetro da solicitação HTTP.
 * @param {string} _data - Dados opcionais para o decorador (não utilizado neste caso).
 * @param {ExecutionContext} context - Contexto de execução do NestJS.
 * @returns {number} O ID do parâmetro da solicitação HTTP.
 */
export const ParamId = createParamDecorator((_data: string, context: ExecutionContext) => {
    
    return Number(context.switchToHttp().getRequest().params.id);

});