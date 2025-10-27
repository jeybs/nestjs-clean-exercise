import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { IUseCase } from 'src/core/domain/usecases/usecase.interface';
import { UserModel } from '../../domain/models/user.model';
import { pipe } from 'fp-ts/lib/function';
import { match } from 'fp-ts/lib/Either';
import { ErrorHelper } from 'src/core/helper/error.helper';
import { LoggerUtils } from 'src/core/logger/logger.service';
import { UserResponse } from './response/user.response';
import { HashedIdPipe } from 'src/core/pipes/hashed-id.pipe';
import { CreateUserModel } from '../../domain/models/inputs/create-user.model';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  TAG = UserController.name;

  constructor(
    @Inject('ICreateUserUseCase')
    private readonly createUserUseCase: IUseCase<CreateUserModel, UserModel>,

    @Inject('IFindAllUsersUseCase')
    private readonly findAllUsersUseCase: IUseCase<void, UserModel[]>,
  ) {}

  @Post('/')
  @HttpCode(201)
  async createUser(@Body() body: CreateUserInput) {
    const createUserResult = await this.createUserUseCase.execute(
      plainToInstance(CreateUserModel, body),
    );
    LoggerUtils.debug(this.TAG, `Input Body: ${JSON.stringify(body)}`);

    return pipe(
      createUserResult,
      match(
        (err) => {
          ErrorHelper.throwHttpError(err.message, HttpStatus.BAD_REQUEST);
        },
        (result) => {
          LoggerUtils.debug(this.TAG, 'User create sucessfully!');
          return UserResponse.modelToResponse(result);
        },
      ),
    );
  }

  @Get('id/:userId')
  @HttpCode(200)
  async finUser(@Param('userId', HashedIdPipe) userId: number) {
    // const findAllUsersResult = await this.findAllUsersUseCase.execute();

    // return pipe(
    //   findAllUsersResult,
    //   match(
    //     (err) => {
    //       ErrorHelper.throwHttpError(err.message, HttpStatus.BAD_REQUEST);
    //     },
    //     (result) => {
    //       const test = UserResponse.modelsToResponseList(result);
    //       LoggerUtils.debug(this.TAG, test);
    //       return UserResponse.modelsToResponseList(result);
    //     },
    //   ),
    // );
    return {
      userId,
    };
  }

  @Get('list')
  @HttpCode(200)
  async finUserList() {
    const findAllUsersResult = await this.findAllUsersUseCase.execute();

    return pipe(
      findAllUsersResult,
      match(
        (err) => {
          ErrorHelper.throwHttpError(err.message, HttpStatus.BAD_REQUEST);
        },
        (result) => {
          const test = UserResponse.modelsToResponseList(result);
          LoggerUtils.debug(this.TAG, test);
          return UserResponse.modelsToResponseList(result);
        },
      ),
    );
  }
}
