import { Expose, plainToInstance } from 'class-transformer';
import { UserEntity, UserRole } from '../../data/entities/user.entity';

export class UserModel {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  password: string;

  role: UserRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  static entityToModel(entity: UserEntity): UserModel {
    return plainToInstance(UserModel, entity, {
      excludeExtraneousValues: true,
    });
  }

  static entitiesToModels(entity: UserEntity[]): UserModel[] {
    return plainToInstance(UserModel, entity, {
      excludeExtraneousValues: true,
    });
  }
}
