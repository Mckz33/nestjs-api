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

    isValidToken(token: string) {
        try {
            this.checkToken(token)
            return true;
        } catch (error) {
            return false;
        }
    }

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

    async register(data: AuthRegisterDTO) {
        const user = await this.userService.create(data);
        return this.createToken(user);
    }

}