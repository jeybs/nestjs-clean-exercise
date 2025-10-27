import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUsersUseCase } from 'src/features/user/domain/usecases/find-all-user.usecase';
import { IUserRepository } from 'src/features/user/domain/repositories/user.repository.interface';
import { UserModel } from 'src/features/user/domain/models/user.model';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { left, right } from 'fp-ts/lib/Either';
import { RestFailure } from 'src/core/error/failure';

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;
  let repository: jest.Mocked<IUserRepository>;

  const mockRepository: jest.Mocked<IUserRepository> = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUsersUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
    repository = module.get('IUserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return list of users on success', async () => {
    const users: UserModel[] = [
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
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'hashed',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const task: TaskEither<RestFailure, UserModel[]> = async () => right(users);
    repository.findAllUsers.mockReturnValue(task);

    const result = await useCase.execute();

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      expect(Array.isArray(result.right)).toBe(true);
      expect(result.right.length).toBe(2);
      expect(result.right[0].email).toBe('john.doe@example.com');
    }
    expect(repository.findAllUsers).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when repository returns no users', async () => {
    const users: UserModel[] = [];
    const task: TaskEither<RestFailure, UserModel[]> = async () => right(users);
    repository.findAllUsers.mockReturnValue(task);

    const result = await useCase.execute();

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      expect(result.right.length).toBe(0);
    }
  });

  it('should return failure when repository fails', async () => {
    const failure = new RestFailure('Database error');
    const task: TaskEither<RestFailure, UserModel[]> = async () => left(failure);
    repository.findAllUsers.mockReturnValue(task);

    const result = await useCase.execute();

    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left.message).toBe('Database error');
    }
  });
});


