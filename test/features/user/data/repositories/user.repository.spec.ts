import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/features/user/data/repositories/user.repository';
import { IUserDatasource } from 'src/features/user/data/datasources/user.datasource.interface';
import { CreateUserModel } from 'src/features/user/domain/models/inputs/create-user.model';
import { UserEntity } from 'src/features/user/data/entities/user.entity';

describe('UserRepository', () => {
  let repository: UserRepository;
  let datasource: jest.Mocked<IUserDatasource>;

  const mockDatasource: jest.Mocked<IUserDatasource> = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: 'IUserDatasource',
          useValue: mockDatasource,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    datasource = module.get('IUserDatasource');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return mapped users', async () => {
      const entities: UserEntity[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'hashed',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      datasource.findAllUsers.mockResolvedValue(entities);

      const result = await repository.findAllUsers()();

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right[0].email).toBe('john.doe@example.com');
      }
    });

    it('should return Left on datasource error', async () => {
      datasource.findAllUsers.mockRejectedValue(new Error('db error'));

      const result = await repository.findAllUsers()();

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left.message).toBe('db error');
      }
    });
  });

  describe('createUser', () => {
    it('should return mapped user model on success', async () => {
      const input: CreateUserModel = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'secret',
        role: 'USER',
      };

      const entity: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashed',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      datasource.createUser.mockResolvedValue(entity);

      const result = await repository.createUser(input)();

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right.email).toBe(entity.email);
        expect(result.right.firstName).toBe(entity.firstName);
      }
    });

    it('should return Left on datasource rejection', async () => {
      const input: CreateUserModel = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'secret',
        role: 'USER',
      };
      datasource.createUser.mockRejectedValue(new Error('create error'));

      const result = await repository.createUser(input)();

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left.message).toBe('create error');
      }
    });
  });
});


