import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { UpdatePatchUserDTO } from "src/dtos/update-patch-user.dto";
import { UpdatePutUserDTO } from "src/dtos/update-put-user.dto copy";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

    /**
     * Construtor do serviço UserService.
     * @param {PrismaService} prisma - Instância do serviço PrismaService.
     */

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Cria um novo usuário.
     * @param {CreateUserDTO} userData - Dados do usuário a ser criado.
     * @returns {Promise<any>} - Uma Promise que resolve com os dados do usuário criado.
     */
    async create(data: CreateUserDTO) {

        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);

        return this.prisma.user.create({
            data,
        });

    }

    /**
     * Retorna todos os usuários.
     * @returns {Promise<any[]>} - Uma Promise que resolve com uma matriz de usuários.
     */
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

    /**
     * Encontra um usuário pelo ID.
     * @param {number} id - O ID do usuário.
     * @returns {Promise<any>} - Uma Promise que resolve com os dados do usuário encontrado.
     * @throws {NotFoundException} - Lança NotFoundException se o usuário não for encontrado.
     */
    async findById(id: number) {

        await this.exists(id);
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    /**
     * Atualiza um usuário usando o método PUT.
     * @param {number} id - O ID do usuário.
     * @param {UpdatePutUserDTO} userData - Dados do usuário a serem atualizados.
     * @returns {Promise<any>} - Uma Promise que resolve com os dados do usuário atualizado.
     * @throws {NotFoundException} - Lança NotFoundException se o usuário não for encontrado.
     */
    async updatePut(id: number, { email, name, password, birthAt, role }: UpdatePutUserDTO) {
        await this.exists(id);

        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        return this.prisma.user.update({
            data: { email, name, password, birthAt: birthAt ? new Date(birthAt) : null, role },
            where: {
                id
            }
        });
    }

    /**
     * Atualiza um usuário usando o método PATCH.
     * @param {number} id - O ID do usuário.
     * @param {UpdatePatchUserDTO} userData - Dados do usuário a serem atualizados.
     * @returns {Promise<any>} - Uma Promise que resolve com os dados do usuário atualizado.
     * @throws {NotFoundException} - Lança NotFoundException se o usuário não for encontrado.
     */
    async updatePatch(id: number, { email, name, password, birthAt, role }: UpdatePatchUserDTO) {
        await this.exists(id);

        const data: any = {};
        const updateFields = { email, name, password, birthAt, role };

        for (const key in updateFields) {
            if (updateFields[key] !== undefined) {
                switch (key) {
                    case 'birthAt':
                        data.birthAt = new Date(updateFields[key]);
                        break;
                    case 'email':
                        data.email = email;
                        break;
                    case 'name':
                        data.name = name;
                        break;
                    case 'password':
                        const salt = await bcrypt.genSalt();
                        data.password = await bcrypt.hash(password, salt);
                        break;
                    case 'role':
                        data.role = role;
                        break;
                    default:
                        break;
                }
            }
        }

        return this.prisma.user.update({
            data,
            where: { id }
        });
    }


    /**
     * Exclui um usuário pelo ID.
     * @param {number} id - O ID do usuário a ser excluído.
     * @returns {Promise<any>} - Uma Promise que resolve com os dados do usuário excluído.
     * @throws {NotFoundException} - Lança NotFoundException se o usuário não for encontrado.
     */
    async delete(id: number) {
        await this.exists(id);
        return this.prisma.user.delete({
            where: {
                id
            }
        });
    }

    /**
     * Verifica se um usuário existe pelo ID.
     * @param {number} id - O ID do usuário.
     * @returns {Promise<void>} - Uma Promise vazia.
     * @throws {NotFoundException} - Lança NotFoundException se o usuário não for encontrado.
     */
    async exists(id: number) {
        if (!(await this.prisma.user.count({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`O usuário ${id} não existe.`)
        }
    }

}