import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { Failure } from 'src/core/error/failure';
import { CreateUserModel } from '../../domain/models/inputs/create-user.model';
import { UserModel } from '../../domain/models/user.model';
import { IUserDatasource } from '../datasources/user.datasource.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject('IUserDatasource')
    private readonly datasource: IUserDatasource,
  ) {}

  findAllUsers(): TaskEither<Failure, UserModel[]> {
    return tryCatch(
      async () => {
        const entities = await this.datasource.findAllUsers();
        return UserModel.entitiesToModels(entities);
      },
      (error: Failure) => error,
    );
  }

  createUser(input: CreateUserModel): TaskEither<Failure, UserModel> {
    return tryCatch(
      async () => {
        const entity = await this.datasource.createUser(input);
        return UserModel.entityToModel(entity);
      },
      (error: Failure) => error,
    );
  }
}
