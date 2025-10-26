import { UserRole } from 'src/features/user/data/entities/user.entity';

export class CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
