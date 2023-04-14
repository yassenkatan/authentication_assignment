import { Controller, Get, Post, Body, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiAcceptedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  SignupUserByEmailDto,
  SignupUserByPhoneNumberDto,
} from './dto/signup.dto.ts';
import {
  LoginResponseDto,
  UserNotVerified,
} from './dto/login-user-response.dto';
import { ResendConfirmOTPDto, VerifyUserDto } from './dto/verify-user.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { IsAuthenticatedDto } from './dto/isAuthenticated.dto';
import { User } from 'src/common/decorators/user.decorator';
import { LoginUserDto } from './dto/login.dto.ts';
import { UserModel } from 'src/user/models/user.model';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { RefreshResponseDto } from './dto/refresh-response-dto';
import { ResetPasswordDto, SendOtpCodeDto } from './dto/forget-password.dto';
import { SignupType } from './models/signup-type.enum';

@ApiTags('Auth')
@Controller('client/auth')
export class ClientAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  @Post('signup-phone-number')
  @ApiOperation({
    summary: 'Signup User By Phone Number',
    description: 'Signup User By Phone Number',
  })
  async signupUserByPhoneNumber(
    @Body() signupUserDto: SignupUserByPhoneNumberDto,
  ) {
    return await this.authService.signupUserService(
      SignupType.PhoneNumber,
      signupUserDto,
    );
  }

  @Post('signup-email')
  @ApiOperation({
    summary: 'Signup User By Email',
    description: 'Signup User By Email',
  })
  async signupUserByEmail(@Body() signupUserDto: SignupUserByEmailDto) {
    return await this.authService.signupUserService(
      SignupType.Email,
      signupUserDto,
    );
  }

  @Put('verify-user')
  @ApiOperation({
    summary: 'Verify User By OTP Code',
    description: 'Verify User By OTP Code',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  async verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    const user = await this.authService.verifyUserByOTPCode(
      verifyUserDto?.email,
      verifyUserDto?.otpCode,
    );
    const accessTokenCookie = await this.authService.getJwtToken(user?.email);
    const refreshTokenCookie = await this.authService.getJwtRefreshToken(
      user?.email,
    );
    return {
      ...accessTokenCookie,
      ...refreshTokenCookie,
    };
  }

  @Auth(UserRole.User)
  @Get('is_authenticated')
  @ApiOperation({ description: 'Is authenticated' })
  @ApiOkResponse({ type: IsAuthenticatedDto })
  async isAuthenticated(@User('email') email: string) {
    const user = await this.authService.checkIfAuthenticated(email);
    return this.authService.makeIsAuthenticatedResponse(user);
  }

  @Post('resend-confirm-otp')
  @ApiOperation({
    summary: 'Resend Confirm OTP Code',
    description: 'Resend Confirm By OTP Code',
  })
  @ApiOkResponse({
    type: String,
  })
  async resendConfirmOTPCode(
    @Body() resendConfirmOTPDto: ResendConfirmOTPDto,
  ): Promise<string> {
    return await this.authService.resendConfirmOTPCode(
      resendConfirmOTPDto?.email,
    );
  }

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiAcceptedResponse({ type: UserNotVerified })
  @ApiOperation({ description: 'Local Login' })
  async login(@Body() auth: LoginUserDto) {
    const user: UserModel = await this.authService.validateUserForLocalStrategy(
      auth?.userName,
      auth?.password,
    );

    if (
      user?.userRole !== UserRole?.Admin &&
      user?.userRole !== UserRole?.User
    ) {
      this.exceptionService.forbiddenException({
        message: 'Unauthorized',
      });
    }

    if (user?.isVerified) {
      const accessTokenCookie = await this.authService.getJwtToken(
        auth?.userName,
      );
      const refreshTokenCookie = await this.authService.getJwtRefreshToken(
        auth?.userName,
      );
      return {
        ...accessTokenCookie,
        ...refreshTokenCookie,
      };
    } else {
      return {
        isVerified: user.isVerified,
        email: user?.email,
      };
    }
  }

  @Post('logout')
  @Auth()
  @ApiOperation({ description: 'Log out' })
  async logout(@User('email') email: string): Promise<string> {
    await this.authService.logoutUser(email);
    return 'Logout successful';
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiHeader({ name: 'refresh-token', required: false })
  @ApiOkResponse({ type: RefreshResponseDto })
  @ApiOperation({ description: 'Refresh token' })
  async refresh(@User('email') email: string) {
    const accessToken = await this.authService.getJwtToken(email);
    const refreshToken = await this.authService.getJwtRefreshToken(email);
    return {
      ...accessToken,
      ...refreshToken,
    };
  }

  @Post('forget-password')
  @ApiOperation({
    summary: 'Forget Password',
    description: 'Send OTP Code To Email',
  })
  @ApiOkResponse({ type: String })
  async sendOTPCode(@Body() sendOtpCode: SendOtpCodeDto): Promise<string> {
    return await this.authService.forgetUserPassword(sendOtpCode?.email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Resetting Password',
    description:
      'Send OTP Code And Email And New Password And Confirm New Password',
  })
  @ApiOkResponse({ type: String })
  async resetUserPasswordByOTPCode(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.checkOTPCodeAndResetUserPassword(
      resetPasswordDto?.otpCode,
      resetPasswordDto?.email,
      resetPasswordDto?.newPassword,
    );
  }
}
