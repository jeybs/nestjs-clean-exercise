import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/usecases/usecase.interface';
import { UserModel } from '../models/user.model';
import { Either } from 'fp-ts/lib/Either';
import { Failure } from 'src/core/error/failure';
import { IUserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class FindAllUsersUseCase implements IUseCase<void, UserModel[]> {
  constructor(
    @Inject('IUserRepository')
    private readonly repo: IUserRepository,
  ) {}

  async execute(input: void): Promise<Either<Failure, UserModel[]>> {
    const findAllUsersTask = this.repo.findAllUsers();
    return await findAllUsersTask();
  }
}
