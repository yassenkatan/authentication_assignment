import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { IsAuthenticatedDto } from './dto/isAuthenticated.dto';
import { User } from 'src/common/decorators/user.decorator';
import { LoginResponseDto } from './dto/login-user-response.dto';
import { LoginUserDto } from './dto/login.dto.ts';
import { UserModel } from 'src/user/models/user.model';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { RefreshResponseDto } from './dto/refresh-response-dto';
import { ResetPasswordDto, SendOtpCodeDto } from './dto/forget-password.dto';

@ApiTags('Auth')
@Controller('dashboard/auth')
export class AdminAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  @Auth(UserRole.Admin)
  @Get('is_authenticated')
  @ApiOperation({ description: 'Is authenticated' })
  @ApiOkResponse({ type: IsAuthenticatedDto })
  async isAuthenticated(@User('email') email: string) {
    const user = await this.authService.checkIfAuthenticated(email);
    return this.authService.makeIsAuthenticatedResponse(user);
  }

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiOperation({ description: 'Local Login' })
  async login(@Body() auth: LoginUserDto) {
    const user: UserModel = await this.authService.validateUserForLocalStrategy(
      auth?.userName,
      auth?.password,
    );

    if (user?.userRole !== UserRole?.Admin) {
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
      this.exceptionService.forbiddenException({
        message: 'Admin isn`t verified',
      });
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
