import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma/prisma.service";

const fakePosts = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "StrongPassword123",
    birthAt: "1990-01-01",
    role: 1
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "StrongPassword456",
    // birthAt: "1985-06-15", // Opcional, se não for necessário, pode remover esta propriedade
    role: 1
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    password: "weak", // Senha fraca, não atende aos requisitos mínimos
    birthAt: "1975-09-30",
    role: 1
  },
];

// E depois nosso objeto de mock do Prisma, retornando os dados falsos
const prismaMock = {
  post: {
    create: jest.fn().mockReturnValue(fakePosts[0]),
    getAll: jest.fn().mockResolvedValue(fakePosts),
    findById: jest.fn().mockResolvedValue(fakePosts[0]),
    updatePut: jest.fn().mockResolvedValue(fakePosts[0]),
    // updatePatch: jest.fn()
    delete: jest.fn()
    // exists: jest.fn()
  },
};

describe('UserService', () => {

  beforeEach(async () => {

    let userService: UserService;
    let prismaService: PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService, useValue: prismaMock
        }
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('Validar a definição', () => {
    expect(UserService).toBeDefined();
  });

});