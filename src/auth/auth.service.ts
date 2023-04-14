import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from 'src/common/config/environment-config/environment-config.service';
import { EventService } from 'src/common/event/event.service';
import { EventTypes } from 'src/common/event/models/event.enum';
import { OTPCodeEventPayload } from 'src/common/event/models/event.payload';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt.service';
import { IJwtServicePayload } from 'src/common/services/jwt/jwt.interface';
import { JwtTokenService } from 'src/common/services/jwt/jwt.service';
import { UserRepository } from 'src/user/user.repository';
import { IsAuthenticatedResponseModel } from './models/isAuthenticated-response.model';
import { UserModel } from 'src/user/models/user.model';
import { SignupType } from './models/signup-type.enum';
import { SignupUserModel } from './models/signup-user.model';
import { UserService } from 'src/user/user.service';
import { UserResponseForClientModel } from 'src/user/models/user-response.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly exceptionService: ExceptionsService,
    private readonly eventEmitter: EventService,
    private readonly jwtConfig: EnvironmentConfigService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async getUserByUserName(userName: string): Promise<UserModel> {
    const userByPhoneNumber: UserModel =
      await this.userRepository.getUserByPhoneNumber(userName);
    if (userByPhoneNumber) {
      return userByPhoneNumber;
    }
    const userByEmail: UserModel = await this.userRepository.getUserByEmail(
      userName,
    );
    if (userByEmail) {
      return userByEmail;
    }
  }

  async signupUserService(
    signupType: SignupType,
    signupUserModel: SignupUserModel,
  ): Promise<UserResponseForClientModel> {
    const { hashedPassword } = await this.hashPassword(
      signupUserModel?.password,
    );
    signupUserModel.password = hashedPassword;

    const otpCode = await this.generateOTPCode();

    const existUserByEmail = await this.userRepository.getUserByEmail(
      signupUserModel?.email,
    );

    const existUserByEmailAndPhoneNumber =
      await this.userRepository.getUserByEmailAndPhoneNumber(
        signupUserModel?.email,
        signupUserModel?.phoneNumber,
      );
    const existUserByPhoneNumber =
      await this.userRepository.getUserByPhoneNumber(
        signupUserModel?.phoneNumber,
      );
    if (existUserByEmailAndPhoneNumber) {
      if (existUserByEmailAndPhoneNumber?.isVerified) {
        this.exceptionService.badRequestException({
          message: 'User is exist',
        });
      } else {
        this.exceptionService.badRequestException({
          message: 'User isn`t verified',
        });
      }
    }
    if (existUserByEmail) {
      this.exceptionService.badRequestException({
        message: 'User exist by email',
      });
    } else if (existUserByPhoneNumber) {
      this.exceptionService.badRequestException({
        message: 'User exist by phone number',
      });
    }

    let user: UserModel = await this.userRepository.createNewUser(
      signupUserModel,
    );

    if (signupType === SignupType.Email) {
      await this.userRepository.saveOTPCodeAndExpireDate(user, otpCode);
      const payload: OTPCodeEventPayload = {
        user: user,
        otpCode: otpCode,
      };
      this.eventEmitter.emit(EventTypes.UserCreated, payload);
      return await this.userService.makeUserResponseForClient(user);
    } else if (signupType === SignupType.PhoneNumber) {
      // We can send OTP code by SMS message
      user = await this.userRepository.verifyUser(user);
      return await this.userService.makeUserResponseForClient(user);
    }
  }

  async resendConfirmOTPCode(email: string): Promise<string> {
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);

    if (user) {
      if (!user?.isVerified) {
        const otpCode = await this.generateOTPCode();
        await this.userRepository.saveOTPCodeAndExpireDate(user, otpCode);
        const payload: OTPCodeEventPayload = {
          user: user,
          otpCode: otpCode,
        };

        this.eventEmitter.emit(EventTypes.ResendConfirmationOTP, payload);
        return 'OTP code sent';
      } else {
        this.exceptionService.badRequestException({
          message: 'User is verified',
        });
      }
    }
  }

  async verifyUserByOTPCode(
    email: string,
    otpCode: number,
  ): Promise<UserModel> {
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
    const otpExpireDate = this.jwtConfig.getOTPCodeExpiationTime();

    if (user) {
      const otpDuration = Date.now() - Number(user?.otpCodeExpireDate);

      if (user?.otpCode === otpCode) {
        if (Number(otpDuration) < Number(otpExpireDate) * 1000) {
          return await this.userRepository.verifyUser(user);
        } else {
          this.exceptionService.badRequestException({
            message: 'OTP code expired',
          });
        }
      } else {
        this.exceptionService.badRequestException({
          message: 'Invalid OTP code',
        });
      }
    }
  }

  async validateUserForLocalStrategy(
    userName: string,
    password: string,
  ): Promise<UserModel> {
    const user = await this.getUserByUserName(userName);
    if (!user) {
      return null;
    }
    const match = await this.bcryptService.compare(password, user?.password);
    if (!match) {
      this.exceptionService.badRequestException({
        message: 'Username or Password incorrect',
      });
    }
    if (user && match) {
      await this.updateLoginTime(user?.email);
      return user;
    }
    return null;
  }

  async validateUserForJWTStrategy(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async getJwtToken(
    userName: string,
  ): Promise<{ accessToken: string; accessTokenExpirationDate: Date }> {
    let payload: IJwtServicePayload;
    const userByEmail = await this.userRepository.getUserByEmail(userName);
    if (userByEmail) {
      payload = { email: userByEmail?.email };
    }
    const userByPhoneNumber = await this.userRepository.getUserByPhoneNumber(
      userName,
    );
    if (userByPhoneNumber) {
      payload = { email: userByPhoneNumber?.email };
    }
    const secret = this.jwtConfig.getJwtSecret();
    const expirationTime = Number(this.jwtConfig.getJwtExpirationTime());
    const expiresIn = expirationTime + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    const currentTime = new Date();
    const accessTokenExpirationDate = new Date(
      currentTime.setSeconds(currentTime.getSeconds() + expirationTime),
    );
    return {
      accessToken: token,
      accessTokenExpirationDate: accessTokenExpirationDate,
    };
  }

  async getJwtRefreshToken(
    userName: string,
  ): Promise<{ refreshToken: string; refreshTokenExpirationDate: Date }> {
    let payload: IJwtServicePayload;
    const userByEmail = await this.userRepository.getUserByEmail(userName);
    if (userByEmail) {
      payload = { email: userByEmail?.email };
    }
    const userByPhoneNumber = await this.userRepository.getUserByPhoneNumber(
      userName,
    );
    if (userByPhoneNumber) {
      payload = { email: userByPhoneNumber?.email };
    }
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expirationTime = Number(this.jwtConfig.getJwtRefreshExpirationTime());
    const expiresIn = expirationTime + 's';

    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);

    const currentTime = new Date();
    const refreshTokenExpirationDate = new Date(
      currentTime.setSeconds(currentTime.getSeconds() + expirationTime),
    );

    await this.setCurrentRefreshToken(token, payload?.email);
    return {
      refreshToken: token,
      refreshTokenExpirationDate: refreshTokenExpirationDate,
    };
  }

  async getUserFromAuthToken(token: string): Promise<UserModel> {
    try {
      const payload = await this.jwtTokenService.checkToken(token, {
        secret: this.jwtConfig.getJwtSecret(),
      });

      const email = payload?.email;

      if (email) {
        return this.userRepository.getUserByEmail(email);
      } else {
        return null;
      }
    } catch (error) {
      this.exceptionService.notFoundException({
        message: [error?.message],
      });
    }
  }

  async checkIfAuthenticated(email: string): Promise<UserModel> {
    return this.userRepository.getUserByEmail(email);
  }

  async makeIsAuthenticatedResponse(
    user: UserModel,
  ): Promise<IsAuthenticatedResponseModel> {
    return new IsAuthenticatedResponseModel(user);
  }

  async forgetUserPassword(email: string): Promise<string> {
    const otpCode = await this.generateOTPCode();
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
    const data = await this.userRepository.updateOTPCode(user, otpCode);

    const payload: OTPCodeEventPayload = {
      user: data?.user,
      otpCode: data?.otpCode,
    };

    this.eventEmitter.emit(EventTypes.ForgetPassword, payload);
    return 'Resetting code sent, Please check your email';
  }

  async checkOTPCodeAndResetUserPassword(
    otpCode: number,
    email: string,
    newPassword: string,
  ): Promise<string> {
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
    if (user) {
      const otpExpireDate = this.jwtConfig.getOTPCodeExpiationTime();

      if (user.otpCodeExpireDate) {
        const otpDuration = BigInt(Date.now()) - user?.otpCodeExpireDate;

        if (user?.otpCode == otpCode) {
          if (otpDuration < otpExpireDate * 1000) {
            const salt = await this.bcryptService.genSalt();
            const newHashPassword = await this.bcryptService.hash(
              newPassword,
              salt,
            );
            await this.userRepository.updateUserPassword(user, newHashPassword);
            return 'Resetting password done';
          } else {
            this.exceptionService.badRequestException({
              message: 'OTP code expired',
            });
          }
        } else {
          this.exceptionService.badRequestException({
            message: 'Invalid OTP code',
          });
        }
      } else {
        this.exceptionService.badRequestException({
          message: 'OTP code expired',
        });
      }
    }
  }

  private async hashPassword(password: string): Promise<{
    hashedPassword: string;
  }> {
    const salt = await this.bcryptService.genSalt();
    const hashedPassword = await this.bcryptService.hash(password, salt);
    return { hashedPassword };
  }

  private async generateOTPCode(): Promise<number> {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    email: string,
  ): Promise<void> {
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken,
    );
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
    await this.userRepository.updateRefreshToken(
      user,
      currentHashedRefreshToken,
    );
  }

  async updateLoginTime(email: string): Promise<void> {
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
    await this.userRepository.updateLastLogin(user);
  }

  async logoutUser(email: string): Promise<void> {
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
    await this.userRepository.updateRefreshToken(user, null);
  }
}
