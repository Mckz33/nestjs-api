import { Injectable } from "@nestjs/common";
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { UpdatePatchUserDTO } from "src/dtos/update-patch-user.dto";
import { UpdatePutUserDTO } from "src/dtos/update-put-user.dto copy";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    async create({ email, nome, password }: CreateUserDTO) {

        return this.prisma.user.create({
            data: {
                email,
                nome,
                password
            },
            // select: {
            //     id: true,
            //     nome: true
            // }
        });

    }

    async getAll() {
        return this.prisma.user.findMany(
            //     {
            //     where: {
            //         email: {
            //             contains: '@gmail.com'
            //         }
            //     }
            // }
        );
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async updatePut(id: number, data: UpdatePutUserDTO) {
        return this.prisma.user.update({
            data,
            where: {
                id
            }
        });
    }
    async updatePatch(id: number, data: UpdatePatchUserDTO) {
        return this.prisma.user.update({
            data,
            where: {
                id
            }
        });
    }
}