import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class UserIdCheckMiddleware implements NestMiddleware {

    /**
     * Middleware para verificar a validade do ID de usuário na solicitação.
     * @param {Request} req - O objeto de solicitação HTTP.
     * @param {Response} res - O objeto de resposta HTTP.
     * @param {NextFunction} next - A próxima função no pipeline de middleware.
     * @returns {void} Não há retorno explícito, mas invoca a próxima função no pipeline de middleware.
     * @throws {BadRequestException} Lança um erro de BadRequestException se o ID do usuário na solicitação for inválido.
     */
    use(req: Request, res: Response, next: NextFunction) {
        console.log('UserIdCheckMiddleware', 'antes')
        
        if (isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) {
            throw new BadRequestException('ID inváido!')
        }
        console.log('UserIdCheckMiddleware', 'depois')
        next();
    }

}