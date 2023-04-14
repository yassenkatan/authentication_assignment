import { Controller, Get, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ResetMyPasswordDto } from './dto/reset-my-password.dto';
import { UserResponseForClientDto } from './dto/user-response.dto';
import { UserModel } from './models/user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './models/user-role.enum';

@Auth(UserRole.User)
@ApiTags('User')
@Controller('client/user')
export class ClientUserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get My Profile',
    description: 'Get My Profile',
  })
  @ApiOkResponse({
    description: 'Get My Profile Success',
    type: UserResponseForClientDto,
  })
  @Get('get-my-profile')
  async getMyProfile(@User('id') id: string) {
    const user: UserModel = await this.userService.checkIfUserFindByIdAndGetIt(
      id,
    );
    return await this.userService.makeUserResponseForClient(user);
  }

  @ApiOperation({
    summary: 'Update My Profile',
    description: 'Update My Profile',
  })
  @ApiOkResponse({
    description: 'Update My Profile Success',
    type: UserResponseForClientDto,
  })
  @Put('update-my-profile')
  async updateMyProfile(
    @User('id') id: string,
    @Body() updateMyProfile: UpdateUserDto,
  ) {
    const user = await this.userService.updateMyProfile(id, updateMyProfile);
    return await this.userService.makeUserResponseForClient(user);
  }

  @ApiOperation({
    summary: 'Change My Password',
    description: 'Change My Password',
  })
  @ApiOkResponse({
    description: 'Change My Password Success',
    type: String,
  })
  @Put('change-my-password')
  async changeMyPassword(
    @User('id') id: string,
    @Body() resetMyPasswordDto: ResetMyPasswordDto,
  ) {
    return await this.userService.resetMyPassword(
      id,
      resetMyPasswordDto?.oldPassword,
      resetMyPasswordDto?.newPassword,
    );
  }
}
