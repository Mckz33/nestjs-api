import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from "path";
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ) { }

    /**
     * Rota para login de usuário.
     * @param {AuthLoginDTO} body - Dados para login do usuário.
     * @returns {Promise<any>} Promessa que resolve para o token de acesso do usuário.
     */
    @Post('login')
    async login(@Body() { email, password }: AuthLoginDTO) {
        return this.authService.login(email, password)
    }

    /**
     * Rota para registro de novo usuário.
     * @param {AuthRegisterDTO} body - Dados para registro do novo usuário.
     * @returns {Promise<any>} Promessa que resolve para o token de acesso do usuário registrado.
     */
    @Post('register')
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
    }

    /**
     * Rota para solicitar redefinição de senha.
     * @param {AuthForgetDTO} body - Dados para solicitar redefinição de senha.
     * @returns {Promise<boolean>} Promessa que resolve para true se a solicitação for bem-sucedida.
     */
    @Post('forget')
    async forget(@Body() { email }: AuthForgetDTO) {
        return this.authService.forget(email);
    }

    /**
     * Rota para redefinir a senha do usuário.
     * @param {AuthResetDTO} body - Dados para redefinir a senha do usuário.
     * @returns {Promise<any>} Promessa que resolve para o token de acesso após a redefinição da senha.
     */
    @Post('reset')
    async reset(@Body() { password, token }: AuthResetDTO) {
        return this.authService.reset(password, token);
    }

    /**
     * Rota para obter informações do usuário autenticado.
     * @param {User} user - Usuário autenticado extraído do token.
     * @returns {Promise<any>} Promessa que resolve para os detalhes do usuário autenticado.
     */
    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user) {
        return { user };
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(@User() user, @UploadedFile() photo: Express.Multer.File) {

        const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`)

        try {
            await this.fileService.upload(photo, path);
        } catch (error) {
            throw new BadRequestException(error)
            
        }


        return { sucess: true };
    }
}