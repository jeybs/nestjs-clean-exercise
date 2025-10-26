import { Expose, plainToInstance, Transform } from 'class-transformer';
import { HashHelper } from 'src/core/helper/hash.helper';
import { UserRole } from 'src/features/user/data/entities/user.entity';
import { UserModel } from 'src/features/user/domain/models/user.model';

export class UserResponse {
  @Expose()
  @Transform(({ value }) => HashHelper.encodeId(value), { toPlainOnly: true })
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  static modelToResponse(model: UserModel): UserResponse {
    return plainToInstance(UserResponse, model, {
      excludeExtraneousValues: true,
    });
  }

  static modelsToResponseList(model: UserModel[]): UserResponse[] {
    return plainToInstance(UserResponse, model, {
      excludeExtraneousValues: true,
    });
  }
}
