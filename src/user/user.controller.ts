import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { UpdatePatchUserDTO } from "src/dtos/update-patch-user.dto";
import { UpdatePutUserDTO } from "src/dtos/update-put-user.dto copy";

@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Get()
    async list() {
        return this.userService.getAll();
    }

    @Get(':id')
    async readOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findById(id);
    }

    @Put(':id')
    async updatePut(@Body() data: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number) {

        return this.userService.updatePut(id, data);
    }
    @Patch(':id')
    async updatePatch(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updatePatch(id, data);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }

}