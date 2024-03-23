import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdatePutUserDTO } from '../dtos/update-put-user.dto';
import { UpdatePatchUserDTO } from '../dtos/update-patch-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../enums/role.enum';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@gmail.com', password: 'password1', birthAt: '2000-01-01', role: Role.User },
  { id: 2, name: 'Jane Smith', email: 'jane@gmail.com', password: 'password2', birthAt: '1995-05-15', role: Role.Admin },
  { id: 3, name: 'Bob Johnson', email: 'bob@gmail.com', password: 'password3', birthAt: '1980-10-30', role: Role.User },
];

// Mock PrismaService
const prismaServiceMock = () => ({
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
});

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useFactory: prismaServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDTO = {
        id: 1,
        name: "Mackenzie",
        email: "john@gmail.com",
        password: `Abcd@a1b2c3d4`,
        birthAt: "2000-01-01",
        role: Role.User
      };

      const expectedResult = { id: 1, ...createUserDto };

      prismaService.user.create = jest.fn().mockResolvedValue(expectedResult);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedResult = [{
        id: 1,
        name: "Mackenzie",
        email: "john@gmail.com",
        password: `Abcd@a1b2c3d4`,
        birthAt: "2000-01-01",
        role: Role.User 
      }];

      prismaService.user.findMany = jest.fn().mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const expectedResult = [{
        id: 1,
        name: "Mackenzie",
        email: "john@gmail.com",
        password: `Abcd@a1b2c3d4`,
        birthAt: "2000-01-01",
        role: Role.User 
      }];

      jest.spyOn(service, 'exists').mockResolvedValue();

      prismaService.user.findUnique = jest.fn().mockResolvedValue(expectedResult);

      const result = await service.findById(1);

      expect(result).toEqual(expectedResult);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePut', () => {
    it('should update a user using PUT method', async () => {
      const updatePutUserDto: UpdatePutUserDTO = {
        id: 1,
        name: "John Doe",
        email: "john@gmail.com",
        password: `Abcd@abcd1234`,
        birthAt: "2000-01-01",
        role: Role.User
      };
  
      const expectedResult = { ...updatePutUserDto };
  
      jest.spyOn(service, 'exists').mockResolvedValue();
  
      prismaService.user.update = jest.fn().mockResolvedValue(expectedResult);
  
      const result = await service.updatePut(1, updatePutUserDto);
  
      expect(result).toEqual(expectedResult);
  
      expect(prismaService.user.update).toHaveBeenCalledTimes(1);
  
      expect(service.exists).toHaveBeenCalledWith(1);
    });
  });
  
  describe('updatePatch', () => {
    it('should partially update a user', async () => {
      const updatePatchUserDto: UpdatePatchUserDTO = {
        name: 'Mackenzie',
      };

      const expectedResult = { id: 1, name: 'Mackenzie' };

      jest.spyOn(service, 'exists').mockResolvedValue();

      prismaService.user.update = jest.fn().mockResolvedValue(expectedResult);

      const result = await service.updatePatch(1, updatePatchUserDto);

      expect(result).toEqual(expectedResult);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        data: { name: 'Mackenzie' },
        where: { id: 1 },
      });
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const expectedResult = { id: 1 };
  
      jest.spyOn(service, 'exists').mockResolvedValue();
  
      prismaService.user.delete = jest.fn().mockResolvedValue(expectedResult);
  
      const result = await service.delete(1);
  
      expect(result).toEqual(expectedResult);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(service.exists).toHaveBeenCalledWith(1);
    });
  
    it('should throw NotFoundException if user is not found', async () => {
    
      prismaService.user.count = jest.fn().mockResolvedValue(0);
  
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  
      expect(prismaService.user.count).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

  });
  
});

















// import { Test, TestingModule } from '@nestjs/testing';
// import { PrismaService } from '../prisma/prisma.service';
// import { UserService } from './user.service';
// import { CreateUserDTO } from '../dtos/create-user.dto';
// import { Role } from '../enums/role.enum';


// const fakePosts = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john@gmail.com",
//     password: `$2b$10$VWFC81zhU/ybJkuP5V.lEOuwKFjgG1.fYg0gPZvR3g6vu.5UKbShW`,
//     birthAt: "1990-01-01",
//     role: Role.User,
//     createdAt: Date,
//     updatedAt: Date
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "mckz@gmail.com",
//     password: `$2b$10$VWFC81zhU/ybJkuP5V.lEOuwKFjgG1.fYg0gPZvR3g6vu.5UKbShW`,
//     birthAt: "1985-06-15",
//     role: Role.User,
//     createdAt: Date,
//     updatedAt: Date
//   },
//   {
//     id: 3,
//     name: "Bob Johnson",
//     email: "bob@gmail.com",
//     password: `$2b$10$VWFC81zhU/ybJkuP5V.lEOuwKFjgG1.fYg0gPZvR3g6vu.5UKbShW`,
//     birthAt: "1975-09-30",
//     role: Role.User,
//     createdAt: Date,
//     updatedAt: Date
//   },
// ];

// // Mock PrismaService
// const prismaServiceMock = () => ({
//   user: {
//     create: jest.fn(),
//     findMany: jest.fn(),
//     findUnique: jest.fn(),
//     update: jest.fn(),
//     delete: jest.fn(),
//     count: jest.fn(),
//   },
// });

// describe('UserService', () => {
//   let service: UserService;
//   let prismaService: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         { provide: PrismaService, useFactory: prismaServiceMock },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     prismaService = module.get<PrismaService>(PrismaService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   // describe('create', () => {
//   //   it('should create a user', async () => {
//   //     const createUserDto: CreateUserDTO = {
//   //       id: 1,
//   //       name: "John Doe",
//   //       email: "john@gmail.com",
//   //       password: `Sopi@abcd1234`,
//   //       birthAt: "2000-01-01",
//   //       role: Role.User
//   //     };

//   //     const result = await service.create(createUserDto);

//   //     expect(result).toEqual(createUserDto);
//   //   });
//   // });



//   describe('create', () => {
//     it('should create a user', async () => {
//       // Define os dados de exemplo para criar um usuário
//       const createUserDto: CreateUserDTO = {
//         id: 1,
//         name: "John Doe",
//         email: "john@gmail.com",
//         password: `Sopi@abcd1234`,
//         birthAt: "2000-01-01",
//         role: Role.User
//       };
  
//       // Define o resultado esperado após a criação do usuário
//       const expectedResult = { id: 1, ...createUserDto };
  
//       // Mock da função 'create' do serviço Prisma para simular a criação do usuário
//       prismaService.user.create = jest.fn().mockReturnValueOnce(expectedResult);
  
//       // Chama o método 'create' do serviço UserService com os dados do usuário
//       const result = await service.create(createUserDto);
  
//       // Verifica se o resultado retornado é igual ao resultado esperado
//       expect(result).toEqual(expectedResult);
  
//       // Verifica se a função 'create' do serviço Prisma foi chamada com os dados corretos
//       expect(prismaService.user.create).toHaveBeenCalledWith({
//         data: createUserDto, // Verifica se os dados passados para a função 'create' são os mesmos que foram fornecidos ao método 'create' do UserService
//       });
//     });
//   });
  


  
// });









//=================================================================================








// import { Test, TestingModule } from "@nestjs/testing";
// import { UserService } from "./user.service";
// import { PrismaService } from "../prisma/prisma.service";
// import { CreateUserDTO } from "../dtos/create-user.dto";
// import { Role } from "../enums/role.enum";

// const fakePosts = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john@gmail.com",
//     password: `$2b$10$VWFC81zhU/ybJkuP5V.lEOuwKFjgG1.fYg0gPZvR3g6vu.5UKbShW`,
//     birthAt: "1990-01-01",
//     role: Role.User,
//     createdAt: Date,
//     updatedAt: Date
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "mckz@gmail.com",
//     password: `$2b$10$VWFC81zhU/ybJkuP5V.lEOuwKFjgG1.fYg0gPZvR3g6vu.5UKbShW`,
//     birthAt: "1985-06-15",
//     role: Role.User,
//     createdAt: Date,
//     updatedAt: Date
//   },
//   {
//     id: 3,
//     name: "Bob Johnson",
//     email: "bob@gmail.com",
//     password: `$2b$10$VWFC81zhU/ybJkuP5V.lEOuwKFjgG1.fYg0gPZvR3g6vu.5UKbShW`,
//     birthAt: "1975-09-30",
//     role: Role.User,
//     createdAt: Date,
//     updatedAt: Date
//   },
// ];

// const prismaMock = {
//   post: {
//     create: jest.fn(),
//     findAll: jest.fn().mockResolvedValue(fakePosts),
//     findById: jest.fn(),
//     updatePut: jest.fn(),
//     updatePatch: jest.fn(),
//     delete: jest.fn(),
//     exists: jest.fn()
//   },
// };

// describe('UserService', () => {
//   let userService: UserService;
//   let prismaService: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: PrismaService, useValue: prismaMock
//         }
//       ]
//     }).compile();

//     userService = module.get<UserService>(UserService);
//     prismaService = module.get<PrismaService>(PrismaService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('Validar a definição', () => {
//     expect(UserService).toBeDefined();
//   });

//   describe('Create', () => {
//     // it(`should create a new post`, async () => {
//     //   const data: CreateUserDTO = 
//     //   {
//     //     id: 1,
//     //     name: "John Doe",
//     //     email: "john@gmail.com",
//     //     password: `Sopi@abcd1234`,
//     //     birthAt: "2000-01-01",
//     //     role: Role.User
//     //   }
      
//     //   const result = await userService.create(data);
//     // });
//   });

//   describe('GetAll', () => {

//     it("should return an array of posts", async () => {
//       const response = await userService.findAll();
//     });

//   });
//   describe('FindById', () => { });
//   describe('UpdatePut', () => { });
//   describe('UpdatePatch', () => { });
//   describe('Delete', () => { });
//   describe('Exists', () => { });

// });
