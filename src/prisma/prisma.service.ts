import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    /**
     * Inicializa a conexão com o banco de dados quando o módulo é iniciado.
     * @returns {Promise<void>} Uma promessa vazia.
     */
    async onModuleInit() {
        await this.$connect();
    }

    /**
     * Registra hooks de desligamento para fechar a aplicação de forma adequada quando um sinal de desligamento é recebido.
     * @param {INestApplication} app - A instância da aplicação Nest.
     * @returns {void} Não há retorno explícito.
     */
    async enableShutdownHooks(app: INestApplication) {
        process.on('beforeExit', async () => {
            await app.close();
        });
    }

}
