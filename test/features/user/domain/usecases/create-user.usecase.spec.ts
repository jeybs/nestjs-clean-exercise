import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from 'src/features/user/domain/usecases/create-user.usecase';
import { IUserRepository } from 'src/features/user/domain/repositories/user.repository.interface';
import { CreateUserModel } from 'src/features/user/domain/models/inputs/create-user.model';
import { UserModel } from 'src/features/user/domain/models/user.model';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { left, right } from 'fp-ts/lib/Either';
import { RestFailure } from 'src/core/error/failure';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repository: jest.Mocked<IUserRepository>;

  const mockRepository: jest.Mocked<IUserRepository> = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    repository = module.get('IUserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const input: CreateUserModel = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'secret',
      role: 'USER',
    };

    const user: UserModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashed',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const task: TaskEither<RestFailure, UserModel> = async () => right(user);
    repository.createUser.mockReturnValue(task);

    const result = await useCase.execute(input);

    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      expect(result.right.email).toBe(user.email);
    }
    expect(repository.createUser).toHaveBeenCalledWith(input);
  });

  it('should return failure when repository returns Left', async () => {
    const input: CreateUserModel = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'secret',
      role: 'USER',
    };

    const failure = new RestFailure('Email already exists');
    const task: TaskEither<RestFailure, UserModel> = async () => left(failure);
    repository.createUser.mockReturnValue(task);

    const result = await useCase.execute(input);

    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left.message).toBe('Email already exists');
    }
  });
});


