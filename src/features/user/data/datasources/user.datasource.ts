import { PrismaService } from 'src/core/services/prisma.service';
import { CreateUserModel } from '../../domain/models/inputs/create-user.model';
import { UserEntity } from '../entities/user.entity';
import { IUserDatasource } from './user.datasource.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTimeHelper } from 'src/core/helper/datetime.helper';

@Injectable()
export class UserDatasource implements IUserDatasource {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return UserEntity.toEntities(users);
  }

  async createUser(input: CreateUserModel): Promise<UserEntity> {
    return this.prisma.$transaction(async (txn) => {
      const existingUser = await txn.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exist');
      }

      const user = await txn.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: input.password,
          role: input.role,
          createdAt: DateTimeHelper.getUtcDateTime(),
          updatedAt: DateTimeHelper.getUtcDateTime(),
        },
      });

      if (!user) {
        throw new BadRequestException('Something went wrong creating user');
      }

      return UserEntity.toEntity(user);
    });
  }
}
