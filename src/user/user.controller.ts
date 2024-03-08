import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { UpdatePatchUserDTO } from "src/dtos/update-patch-user.dto";
import { UpdatePutUserDTO } from "src/dtos/update-put-user.dto copy";

@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    async create(@Body() body: CreateUserDTO) {
        return this.userService.create(body);
    }

    @Get()
    async read() {
        return { users: [] }
    }

    @Get(':id')
    async readOne(@Param() params) {
        return { users: {}, params }
    }

    @Put(':id')
    async update(@Body() { email, nome, password }: UpdatePutUserDTO, @Param() param) {
        return {
            method: 'put',
            email, nome, password,
            param
        }
    }
    @Patch(':id')
    async updatePartial(@Body() { email, nome, password }: UpdatePatchUserDTO, @Param() param) {
        return {
            method: 'patch',
            email, nome, password,
            param
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return {
            id
        }
    }

}