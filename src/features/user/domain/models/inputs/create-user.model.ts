import { UserRole } from 'src/features/user/data/entities/user.entity';

export class CreateUserModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
