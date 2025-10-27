import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'src/features/user/presentation/rest/user.controller';
import { IUseCase } from 'src/core/domain/usecases/usecase.interface';
import { UserModel } from 'src/features/user/domain/models/user.model';
import { CreateUserModel } from 'src/features/user/domain/models/inputs/create-user.model';
import { CreateUserInput } from 'src/features/user/presentation/rest/dto/create-user.input';
import { left, right } from 'fp-ts/lib/Either';
import { RestFailure } from 'src/core/error/failure';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: jest.Mocked<IUseCase<CreateUserModel, UserModel>>;
  let findAllUsersUseCase: jest.Mocked<IUseCase<void, UserModel[]>>;

  beforeEach(async () => {
    const mockCreateUserUseCase = {
      execute: jest.fn(),
    };

    const mockFindAllUsersUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'ICreateUserUseCase',
          useValue: mockCreateUserUseCase,
        },
        {
          provide: 'IFindAllUsersUseCase',
          useValue: mockFindAllUsersUseCase,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get('ICreateUserUseCase');
    findAllUsersUseCase = module.get('IFindAllUsersUseCase');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully and return 201', async () => {
      const createUserInput: CreateUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'USER',
      };

      const mockUserModel: UserModel = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createUserUseCase.execute.mockResolvedValue(right(mockUserModel));

      const result = await controller.createUser(createUserInput);

      expect(result).toBeDefined();
      expect((result as any).id).toBeDefined();
      expect((result as any).email).toBe(mockUserModel.email);
      expect(createUserUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw error when user creation fails with email already exists', async () => {
      const createUserInput: CreateUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'USER',
      };

      const failure = new RestFailure('Email already exists');
      createUserUseCase.execute.mockResolvedValue(left(failure));

      await expect(controller.createUser(createUserInput)).rejects.toThrow();
      expect(createUserUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should handle database connection errors', async () => {
      const createUserInput: CreateUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'USER',
      };

      const failure = new RestFailure('Database connection failed');
      createUserUseCase.execute.mockResolvedValue(left(failure));

      await expect(controller.createUser(createUserInput)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should validate input data before creating user', async () => {
      const createUserInput: CreateUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'USER',
      };

      const mockUserModel: UserModel = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createUserUseCase.execute.mockResolvedValue(right(mockUserModel));

      await controller.createUser(createUserInput);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: createUserInput.firstName,
          lastName: createUserInput.lastName,
          email: createUserInput.email,
        }),
      );
    });
  });

  describe('finUserList', () => {
    it('should return list of users successfully', async () => {
      const mockUsers: UserModel[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'hashedPassword',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          password: 'hashedPassword',
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      findAllUsersUseCase.execute.mockResolvedValue(right(mockUsers));

      const result = await controller.finUserList();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect((result as unknown as any[]).length).toBe(2);
      expect(findAllUsersUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw error when fetching users fails', async () => {
      const failure = new RestFailure('Unable to fetch users');
      findAllUsersUseCase.execute.mockResolvedValue(left(failure));

      await expect(controller.finUserList()).rejects.toThrow('Unable to fetch users');
      expect(findAllUsersUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      const mockUsers: UserModel[] = [];
      findAllUsersUseCase.execute.mockResolvedValue(right(mockUsers));

      const result = await controller.finUserList();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect((result as unknown as any[]).length).toBe(0);
    });

    it('should handle database connection errors when fetching users', async () => {
      const failure = new RestFailure('Database connection error');
      findAllUsersUseCase.execute.mockResolvedValue(left(failure));

      await expect(controller.finUserList()).rejects.toThrow('Database connection error');
    });

    it('should handle network errors when fetching users', async () => {
      const failure = new RestFailure('Network error');
      findAllUsersUseCase.execute.mockResolvedValue(left(failure));

      await expect(controller.finUserList()).rejects.toThrow('Network error');
    });
  });

  describe('finUser', () => {
    it('should return user id successfully', async () => {
      const userId = 123;

      const result = await controller.finUser(userId);

      expect(result).toBeDefined();
      expect((result as any).userId).toBe(userId);
    });

    it('should handle different userId values', async () => {
      const userId = 456;

      const result = await controller.finUser(userId);

      expect((result as any).userId).toBe(userId);
    });

    it('should handle userId with value 0', async () => {
      const userId = 0;

      const result = await controller.finUser(userId);

      expect((result as any).userId).toBe(userId);
    });
  });
});


