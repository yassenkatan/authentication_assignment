import { UserModel } from 'src/user/models/user.model';

export class UserCreatedEventPayload {
  user: UserModel;
  verificationToken: string;
}

export class ExpiredVerificationTokenEventPayload {
  user: UserModel;
  otpCode: number;
}

export class OTPCodeEventPayload {
  user: UserModel;
  otpCode: number;
}

export class ProductCreatedEventPayload {
  productId: string;
  user: UserModel;
}
