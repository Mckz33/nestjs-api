import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {

    private issuer = 'login';
    private audience = 'users';

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService
    ) { }

    /**
     * Cria um token de acesso com base nos dados do usuário.
     * @param {User} user - Dados do usuário.
     * @returns {Object} Objeto contendo o token de acesso.
     */
    createToken(user: User) {
        return {
            acessToken: this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email
            }, {
                expiresIn: '1 days',
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    /**
     * Verifica a validade de um token.
     * @param {string} token - Token a ser verificado.
     * @returns {Object} Dados do token se for válido.
     * @throws {BadRequestException} Lança uma exceção se o token for inválido.
     */
    checkToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                audience: this.audience,
                issuer: this.issuer,
            });
            return data;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    /**
     * Verifica se um token é válido.
     * @param {string} token - Token a ser verificado.
     * @returns {boolean} true se o token for válido, false caso contrário.
     */
    isValidToken(token: string) {
        try {
            this.checkToken(token)
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Autentica um usuário com base no e-mail e senha fornecidos.
     * @param {string} email - E-mail do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Promise<any>} Promessa que resolve para o token de acesso gerado após a autenticação bem-sucedida.
     * @throws {UnauthorizedException} Exceção se o e-mail ou senha estiverem incorretos.
     */
    async login(email: string, password: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            throw new UnauthorizedException("E-mail e/ou senha incorretos.");
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException("E-mail e/ou senha incorretos.");
        }

        return this.createToken(user);
    }

    /**
     * Envia um e-mail para redefinição de senha do usuário.
     * @param {string} email - O endereço de e-mail do usuário solicitando a redefinição de senha.
     * @returns {Promise<boolean>} - Uma Promise indicando se o e-mail de redefinição de senha foi enviado com sucesso.
     */
    async forget(email: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });
        if (!user) {
            throw new UnauthorizedException("E-mail está incorreto.");
        }

        const token = this.jwtService.sign({
            id: user.id
        }, {
            expiresIn: '30 minutes',
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users',
        });
        await this.mailer.sendMail({
            subject: 'Recuperação de Senha',
            to: 'mackenzie.max.rj@gmail.com',
            template: 'forget',
            context: {
                name: user.name,
                token
            }
        });

        return true;
    }

    /**
     * Reseta a senha do usuário com base no token de redefinição de senha.
     * @param {string} password - A nova senha a ser definida para o usuário.
     * @param {string} token - O token de redefinição de senha associado ao usuário.
     * @returns {Promise<string>} - Uma Promise que resolve com um token de acesso JWT após a redefinição da senha.
     */
    async reset(password: string, token: string) {

        try {
            const data: any = this.jwtService.verify(token, {
                issuer: 'forget',
                audience: 'users',

            });
            if (isNaN(Number(data.id))) {
                throw new BadRequestException("O token é inválido");
            }

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);

            const user = await this.prisma.user.update({
                where: {
                    id: Number(data.id)
                },
                data: {
                    password,
                },
            })
            return this.createToken(user);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    /**
     * Registra um novo usuário.
     * @param {AuthRegisterDTO} data - Dados do usuário a serem registrados.
     * @returns {Object} Objeto contendo o token de acesso.
     */
    async register(data: AuthRegisterDTO) {
        const user = await this.userService.create(data);
        return this.createToken(user);
    }

}