import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * Chave utilizada para armazenar os papéis (funções) requeridos para acessar um recurso.
 */
export const ROLES_KEY = "roles";

/**
 * Decorador para definir os papéis (funções) requeridos para acessar um recurso.
 * @param {...Role[]} roles - Lista de papéis (funções) requeridos.
 * @returns {ReturnType<typeof SetMetadata>} Retorna o resultado da função SetMetadata.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)