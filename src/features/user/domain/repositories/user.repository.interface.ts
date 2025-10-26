import { Failure } from 'src/core/error/failure';
import { CreateUserModel } from '../models/inputs/create-user.model';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { UserModel } from '../models/user.model';

export interface IUserRepository {
  createUser(input: CreateUserModel): TaskEither<Failure, UserModel>;

  findAllUsers(): TaskEither<Failure, UserModel[]>;
}
