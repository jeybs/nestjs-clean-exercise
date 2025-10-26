import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/usecases/usecase.interface';
import { CreateUserModel } from '../models/inputs/create-user.model';
import { UserModel } from '../models/user.model';
import { Either } from 'fp-ts/lib/Either';
import { Failure } from 'src/core/error/failure';
import { IUserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class CreateUserUseCase implements IUseCase<CreateUserModel, UserModel> {
  constructor(
    @Inject('IUserRepository')
    private readonly repo: IUserRepository,
  ) {}

  async execute(input: CreateUserModel): Promise<Either<Failure, UserModel>> {
    const createUserTask = this.repo.createUser(input);
    return await createUserTask();
  }
}
