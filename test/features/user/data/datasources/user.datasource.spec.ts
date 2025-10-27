import { Test, TestingModule } from '@nestjs/testing';
import { UserDatasource } from 'src/features/user/data/datasources/user.datasource';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateUserModel } from 'src/features/user/domain/models/inputs/create-user.model';
import { BadRequestException } from '@nestjs/common';

describe('UserDatasource', () => {
  let datasource: UserDatasource;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma: any = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDatasource,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    datasource = module.get<UserDatasource>(UserDatasource);
    prisma = module.get(PrismaService) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllUsers', () => {
    it('should fetch and return entities', async () => {
      const rows = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'a@a.com',
          password: 'x',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      (prisma.user.findMany as unknown as jest.Mock).mockResolvedValue(rows);

      const result = await datasource.findAllUsers();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].email).toBe('a@a.com');
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should propagate errors', async () => {
      (prisma.user.findMany as unknown as jest.Mock).mockRejectedValue(new Error('db')); 
      await expect(datasource.findAllUsers()).rejects.toThrow('db');
    });
  });

  describe('createUser', () => {
    it('should throw when email exists', async () => {
      const input: CreateUserModel = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@a.com',
        password: 'x',
        role: 'USER',
      };

      const txn = {
        user: {
          findUnique: jest.fn().mockResolvedValue({ id: 1 }),
          create: jest.fn(),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: any) => cb(txn));

      await expect(datasource.createUser(input)).rejects.toThrow(
        new BadRequestException('Email already exist'),
      );
      expect(txn.user.findUnique).toHaveBeenCalledWith({ where: { email: input.email } });
      expect(txn.user.create).not.toHaveBeenCalled();
    });

    it('should create when email not exists', async () => {
      const input: CreateUserModel = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@a.com',
        password: 'x',
        role: 'USER',
      };

      const created = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@a.com',
        password: 'x',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const txn = {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(created),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: any) => cb(txn));

      const result = await datasource.createUser(input);

      expect(result.email).toBe('a@a.com');
      expect(txn.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: input.password,
          role: input.role,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      });
    });

    it('should throw when create returns falsy', async () => {
      const input: CreateUserModel = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@a.com',
        password: 'x',
        role: 'USER',
      };

      const txn = {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(null),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: any) => cb(txn));

      await expect(datasource.createUser(input)).rejects.toThrow(
        new BadRequestException('Something went wrong creating user'),
      );
    });

    it('should propagate transaction errors', async () => {
      const input: CreateUserModel = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@a.com',
        password: 'x',
        role: 'USER',
      };

      prisma.$transaction.mockRejectedValue(new Error('txn'));

      await expect(datasource.createUser(input)).rejects.toThrow('txn');
    });
  });
});


