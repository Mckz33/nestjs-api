import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {

    private issuer = 'login';
    private audience = 'users';

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService
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
     * Realiza o login de um usuário com e-mail e senha.
     * @param {string} email - E-mail do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Object} Objeto contendo o token de acesso.
     * @throws {UnauthorizedException} Lança uma exceção se as credenciais forem inválidas.
     */
    async login(email: string, password: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
                password
            }
        });
        if (!user) {
            throw new UnauthorizedException("E-mail e/ou senha incorretos.");
        }
        return this.createToken(user);
    }

    /**
     * Solicita a redefinição da senha do usuário com base no e-mail.
     * @param {string} email - E-mail do usuário.
     * @returns {boolean} true se a solicitação for bem-sucedida.
     * @throws {UnauthorizedException} Lança uma exceção se o e-mail fornecido não estiver associado a nenhum usuário.
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
        return true;
    }

    /**
     * Redefine a senha do usuário com base no token fornecido.
     * @param {string} password - Nova senha do usuário.
     * @param {string} token - Token de redefinição de senha.
     * @returns {Object} Objeto contendo o token de acesso.
     */
    async reset(password: string, token: string) {
        const id = 0;
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                password,
            },
        })
        return this.createToken(user);
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