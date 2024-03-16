import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "src/dtos/create-user.dto";
import { UpdatePatchUserDTO } from "src/dtos/update-patch-user.dto";
import { UpdatePutUserDTO } from "src/dtos/update-put-user.dto copy";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Cria um novo usuário com os dados fornecidos.
     * @param {CreateUserDTO} userData - Os dados do usuário a serem criados.
     * @param {string} userData.email - O endereço de email do novo usuário.
     * @param {string} userData.nome - O nome do novo usuário.
     * @param {string} userData.password - A senha do novo usuário.
     * @returns {Promise<any>} Uma promessa que resolve quando o usuário é criado com sucesso.
     */
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

    /**
     * Retorna todos os usuários.
     * @returns {Promise<any[]>} Uma promessa que resolve em uma lista de todos os usuários.
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
     * Retorna um usuário pelo ID.
     * @param {number} id - O ID do usuário a ser retornado.
     * @returns {Promise<any>} Uma promessa que resolve no usuário correspondente ao ID fornecido.
     * @throws {Error} Lança um erro se o usuário não existir.
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
     * Atualiza um usuário pelo ID com os dados fornecidos.
     * @param {number} id - O ID do usuário a ser atualizado.
     * @param {UpdatePutUserDTO} userData - Os dados do usuário a serem atualizados.
     * @param {string} userData.email - O novo endereço de email do usuário.
     * @param {string} userData.nome - O novo nome do usuário.
     * @param {string} userData.password - A nova senha do usuário.
     * @param {Date | null} userData.birthAt - A nova data de nascimento do usuário ou nulo.
     * @returns {Promise<any>} Uma promessa que resolve quando a atualização é bem-sucedida.
     * @throws {Error} Lança um erro se o usuário não existir.
     */
    async updatePut(id: number, { email, nome, password, birthAt }: UpdatePutUserDTO) {
        await this.exists(id);
        return this.prisma.user.update({
            data: { email, nome, password, birthAt: birthAt ? new Date(birthAt) : null },
            where: {
                id
            }
        });
    }

    /**
     * Atualiza parcialmente um usuário no banco de dados com os dados fornecidos.
     * @param {number} id - O ID do usuário a ser atualizado.
     * @param {Object} userData - Os dados do usuário a serem atualizados.
     * @param {string} userData.email - O novo endereço de email do usuário.
     * @param {string} userData.nome - O novo nome do usuário.
     * @param {string} userData.password - A nova senha do usuário.
     * @param {Date} userData.birthAt - A nova data de nascimento do usuário.
     * @returns {Promise<any>} Uma promessa que resolve quando a atualização é bem-sucedida.
     * @throws {Error} Lança um erro se o usuário não existir.
     */
    async updatePatch(id: number, { email, nome, password, birthAt }: UpdatePatchUserDTO) {
        const data: any = {};
        await this.exists(id);
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

    /**
     * Exclui um usuário pelo ID.
     * @param {number} id - O ID do usuário a ser excluído.
     * @returns {Promise<any>} Uma promessa que resolve quando o usuário é excluído com sucesso.
     * @throws {NotFoundException} Lança um erro se o usuário não existe.
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
     * Verifica se um usuário com o ID fornecido existe no banco de dados.
     * @param {number} id - O ID do usuário a ser verificado.
     * @returns {Promise<void>} Uma promessa vazia.
     * @throws {NotFoundException} Lança um erro se o usuário não existe.
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