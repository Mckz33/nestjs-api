import { ParamId } from 'src/decorators/param-id.decorator';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { UpdatePatchUserDTO } from "src/dtos/update-patch-user.dto";
import { UpdatePutUserDTO } from "src/dtos/update-put-user.dto copy";
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

// @Roles(Role.Admin)
// @UseInterceptors(LogInterceptor)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    /**
     * Cria um novo usuário.
     * @param {CreateUserDTO} data - Dados para criar um novo usuário.
     * @returns {Promise<any>} Promessa que resolve para o usuário criado.
     */
    @Roles(Role.Admin)
    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    /**
     * Obtém todos os usuários.
     * @returns {Promise<any>} Promessa que resolve para uma array de usuários.
     */
    @Roles(Role.Admin, Role.User)
    @Get()
    async getAll() {
        return this.userService.getAll();
    }

    /**
     * Encontra um usuário pelo ID.
     * @param {number} id - ID do usuário.
     * @returns {Promise<any>} Promessa que resolve para o usuário encontrado.
     */
    @Roles(Role.Admin)
    @Get(':id')
    async findById(@ParamId() id: number) {
        console.log({ id });
        return this.userService.findById(id);
    }

    /**
     * Atualiza um usuário usando o método PUT.
     * @param {UpdatePutUserDTO} data - Dados para atualizar o usuário.
     * @param {number} id - ID do usuário.
     * @returns {Promise<any>} Promessa que resolve para o usuário atualizado.
     */
    @Roles(Role.Admin)
    @Put(':id')
    async updatePut(@Body() data: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number) {

        return this.userService.updatePut(id, data);
    }

    /**
     * Atualiza um usuário usando o método PATCH.
     * @param {UpdatePatchUserDTO} data - Dados para aplicar patch no usuário.
     * @param {number} id - ID do usuário.
     * @returns {Promise<any>} Promessa que resolve para o usuário com patch aplicado.
     */
    @Roles(Role.Admin)
    @Patch(':id')
    async updatePatch(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updatePatch(id, data);
    }

    /**
     * Exclui um usuário pelo ID.
     * @param {number} id - ID do usuário.
     * @returns {Promise<any>} Promessa que resolve para o usuário excluído.
     */
    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }

}