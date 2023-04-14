import { Controller, Get, Body, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from './models/user-role.enum';
import { ResetMyPasswordDto } from './dto/reset-my-password.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
import { UserResponseForAdminDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'src/common/pagination/dto/pagination-options.dto';
import { PageDto } from 'src/common/pagination/dto/pagination.dto';

@Auth(UserRole.Admin)
@ApiTags('User')
@Controller('dashboard/user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get Users List',
    description: 'Get Users List',
  })
  @ApiOkResponse({
    description: 'Get Users List Success',
    type: [UserResponseForAdminDto],
  })
  @Get('users-list')
  async getUsersList(
    @Query()
    pageOptionsDto?: PageOptionsDto,
  ) {
    const users = await this.userService.getUsersList(pageOptionsDto);

    const response = await this.userService.makeAllUsersResponseForAdmin(
      users?.response,
    );
    const pagination = new PageDto(response, users?.meta);
    return {
      response: {
        users: pagination?.response,
        unVerifiedUsersCount: users?.unVerifiedUsersCount,
      },
      meta: pagination?.meta,
    };
  }

  @ApiOperation({
    summary: 'Update User Profile',
    description: 'Update User Profile',
  })
  @ApiOkResponse({
    description: 'Update User Profile Success',
    type: UserResponseForAdminDto,
  })
  @Put('update-user-profile')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() updateMyProfile: UpdateUserDto,
  ) {
    const user = await this.userService.updateMyProfile(id, updateMyProfile);
    return await this.userService.makeUserResponseForAdmin(user);
  }

  @ApiOperation({
    summary: 'Change User Password',
    description: 'Change User Password',
  })
  @ApiOkResponse({
    description: 'Change User Password Success',
    type: String,
  })
  @Put('change-user-password/:id')
  async changeUserPassword(
    @Param('id') id: string,
    @Body() resetUserPasswordDto: ResetUserPasswordDto,
  ) {
    return await this.userService.resetUserPassword(
      id,
      resetUserPasswordDto?.newPassword,
    );
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
