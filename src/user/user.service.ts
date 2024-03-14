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

    async updatePut(id: number, { email, nome, password, birthAt }: UpdatePutUserDTO) {
        return this.prisma.user.update({
            data: { email, nome, password, birthAt: birthAt ? new Date(birthAt) : null },
            where: {
                id
            }

        });
    }
    async updatePatch(id: number, { email, nome, password, birthAt }: UpdatePatchUserDTO) {
        const data: any = {};

        const updateFields = { email, nome, password, birthAt };

        for (const key in updateFields) {
            if (updateFields[key] !== undefined) {
                if (key === 'birthAt') {
                    data[key] = new Date(updateFields[key]);
                } else {
                    data[key] = updateFields[key];
                }
            }
        }
        return this.prisma.user.update({
            data,
            where: {
                id
            }
        });
    }

}