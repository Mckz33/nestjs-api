import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { Role } from '../enums/role.enum';

/**
 * Token de acesso utilizado para autenticação.
 * @type {string}
 */
const acessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6Im1ja3oiLCJlbWFpbCI6Im1ja3pAZ21haWwuY29tIiwiaWF0IjoxNzEwNjM3Mjc3LCJleHAiOjE3MTA3MjM2NzcsImF1ZCI6InVzZXJzIiwiaXNzIjoibG9naW4iLCJzdWIiOiI1In0.ZlZjBb5ZYvANFZO6uYkTYaqiYE65hOKAjoytlO4XuMI';

/**
 * Token utilizado para redefinição de senha.
 * @type {string}
 */
const resetToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzExMzE0MTM0LCJleHAiOjE3MTEzMTU5MzQsImF1ZCI6InVzZXJzIiwiaXNzIjoiZm9yZ2V0Iiwic3ViIjoiNCJ9.4pB5NEvKsvhAWe1bXsvnwoLT7w6axGOWvNvMi0wyj3M';

/**
 * Payload JWT contendo informações do usuário.
 * @type {Object}
 */
const jwtPayload = {
    "id": 1,
    "name": "mackenzie",
    "email": "mackenzie@gmail.com",
    "iat": 1711242302,
    "exp": 1711328702,
    "aud": "users",
    "iss": "login",
    "sub": "1"
};

/**
 * Mock do serviço de usuário.
 * @type {Object}
 */
const userServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updatePut: jest.fn(),
    updatePatch: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
};

/**
 * Mock do serviço JWT.
 * @type {Object}
 */
const jwtServiceMock = {
    sign: jest.fn().mockReturnValue(acessToken),
    verify: jest.fn().mockReturnValue(jwtPayload),
};

/**
 * Mock do serviço de envio de emails.
 * @type {Object}
 */
const mailerServiceMock = {
    sendMail: jest.fn()
};

/**
 * Mock do serviço Prisma.
 * @type {Object}
 */
const prismaServiceMock = {
    user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    }
};

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let prismaService: PrismaService;
    let jwtService: JwtService;
    let mailerService: MailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: userServiceMock },
                { provide: PrismaService, useValue: prismaServiceMock },
                { provide: JwtService, useValue: jwtServiceMock },
                { provide: MailerService, useValue: mailerServiceMock },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
        mailerService = module.get<MailerService>(MailerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('Token', () => {
        it('createToken method', () => {
            const expectResult = {
                id: 1,
                name: "Mackenzie",
                email: "john@gmail.com",
                password: `Abcd@a1b2c3d4`,
                birthAt: new Date(),
                role: 1,
                createdAt: new Date(),
                updatedAt: new Date(),

            }

            const result = authService.createToken(expectResult)

            expect(result).toEqual({
                acessToken: acessToken
            })
        });

        it('checkToken', () => {
            const result = authService.checkToken(acessToken)

            expect(result).toEqual(jwtPayload)
        });

        it('isValidToken', () => {
            const result = authService.isValidToken(acessToken)

            expect(result).toEqual(true)
        });
    });

    describe('Autenticação', () => {

        it('login method', async () => {

            authService.login = jest.fn().mockResolvedValue({ acessToken })

            const result = await authService.login('mckz@gmail.com', 'Abcd@abcd1234');

            expect(result).toEqual({ acessToken });

        });

        it('forget method', async () => {

            authService.forget = jest.fn().mockResolvedValue(true)

            const result = await authService.forget('mckz@gmail.com');

            expect(result).toEqual(true);

        });

        it('reset method', async () => {

            authService.reset = jest.fn().mockResolvedValue({ acessToken })

            const result = await authService.reset('Abcd@abcd1234', resetToken);

            expect(result).toEqual({ acessToken });
        });

        it('register method', async () => {
            const authRegisterDTO: CreateUserDTO = {
                name: "Mackenzie",
                email: "john@gmail.com",
                password: `Abcd@a1b2c3d4`,
                birthAt: '2002-01-01',
                role: Role.User
            }

            authService.register = jest.fn().mockResolvedValue({ acessToken })

            const result = await authService.register(authRegisterDTO);

            expect(result).toEqual({ acessToken });
        });

    });

});
