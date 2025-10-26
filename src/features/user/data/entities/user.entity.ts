import { Exclude, plainToInstance } from 'class-transformer';

export type UserRole = 'ADMIN' | 'USER';

export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  static toEntity(json: any): UserEntity {
    return plainToInstance(UserEntity, json);
  }

  static toEntities(json: any[]): UserEntity[] {
    return plainToInstance(UserEntity, json);
  }
}
