import { UserRole } from 'src/user/models/user-role.enum';
import { UserModel } from 'src/user/models/user.model';

export class IsAuthenticatedResponseModel {
  userId: string;
  email: string;
  userRole: UserRole;

  constructor(user?: UserModel) {
    this.userId = user?.id;
    this.email = user?.email;
    this.userRole = user?.userRole;
  }
}
