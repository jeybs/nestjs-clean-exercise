import { CreateUserModel } from '../../domain/models/inputs/create-user.model';
import { UserEntity } from '../entities/user.entity';

export interface IUserDatasource {
  createUser(input: CreateUserModel): Promise<UserEntity>;

  findAllUsers(): Promise<UserEntity[]>;
}
