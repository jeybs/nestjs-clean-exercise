import { Module } from '@nestjs/common';
import { UserController } from './presentation/rest/user.controller';
import { UserDatasource } from './data/datasources/user.datasource';
import { UserRepository } from './data/repositories/user.repository';
import { CreateUserUseCase } from './domain/usecases/create-user.usecase';
import { FindAllUsersUseCase } from './domain/usecases/find-all-user.usecase';

const userDatasourceProvider = [
  {
    provide: 'IUserDatasource',
    useClass: UserDatasource,
  },
];

const userRepositoryProvider = [
  {
    provide: 'IUserRepository',
    useClass: UserRepository,
  },
];

const userUseCaseProvider = [
  {
    provide: 'ICreateUserUseCase',
    useClass: CreateUserUseCase,
  },
  {
    provide: 'IFindAllUsersUseCase',
    useClass: FindAllUsersUseCase,
  },
];

@Module({
  controllers: [UserController],
  providers: [
    ...userDatasourceProvider,
    ...userRepositoryProvider,
    ...userUseCaseProvider,
  ],
  exports: ['ICreateUserUseCase', 'IFindAllUsersUseCase'],
})
export class UserModule {}
