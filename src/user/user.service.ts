import { Injectable } from "@nestjs/common";
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    async create({ email, nome, password }: CreateUserDTO){

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
}