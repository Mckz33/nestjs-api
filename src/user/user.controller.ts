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


// @UseInterceptors(LogInterceptor)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    /**
     * Cria um novo usuário com os dados fornecidos.
     * @param {CreateUserDTO} data - Os dados do usuário a serem criados.
     * @returns {Promise<any>} Uma promessa que resolve quando o usuário é criado com sucesso.
     */
    @Roles(Role.Admin)
    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    /**
     * Retorna uma lista de todos os usuários.
     * @returns {Promise<any[]>} Uma promessa que resolve em uma lista de todos os usuários.
     */
    @Roles(Role.Admin)
    @Get()
    async list() {
        return this.userService.getAll();
    }

    /**
     * Retorna um usuário pelo ID.
     * @param {number} id - O ID do usuário a ser retornado.
     * @returns {Promise<any>} Uma promessa que resolve no usuário correspondente ao ID fornecido.
     */
    @Roles(Role.Admin)
    @Get(':id')
    async readOne(@ParamId() id: number) {
        console.log({ id });
        return this.userService.findById(id);
    }

    /**
     * Atualiza um usuário pelo ID com os dados fornecidos.
     * @param {UpdatePutUserDTO} data - Os dados do usuário a serem atualizados.
     * @param {number} id - O ID do usuário a ser atualizado.
     * @returns {Promise<any>} Uma promessa que resolve quando a atualização é bem-sucedida.
     */
    @Roles(Role.Admin)
    @Put(':id')
    async updatePut(@Body() data: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number) {

        return this.userService.updatePut(id, data);
    }
    /**
     * Atualiza parcialmente um usuário pelo ID com os dados fornecidos.
     * @param {UpdatePatchUserDTO} data - Os dados do usuário a serem atualizados.
     * @param {number} id - O ID do usuário a ser atualizado.
     * @returns {Promise<any>} Uma promessa que resolve quando a atualização parcial é bem-sucedida.
     */
    @Roles(Role.Admin)
    @Patch(':id')
    async updatePatch(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updatePatch(id, data);
    }

    /**
     * Exclui um usuário pelo ID.
     * @param {number} id - O ID do usuário a ser excluído.
     * @returns {Promise<any>} Uma promessa que resolve quando o usuário é excluído com sucesso.
     */
    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }

}