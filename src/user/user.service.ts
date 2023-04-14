import { ExceptionsService } from 'src/common/exceptions/exceptions.service';
import { UserRepository } from './user.repository';
import { UserModel } from './models/user.model';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt.service';
import {
  UserResponseForAdminModel,
  UserResponseForClientModel,
} from './models/user-response.model';
import { UpdateUserModel } from './models/update-user.model';
import { PageOptionsModel } from 'src/common/pagination/models/page-options.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async getUsersList(pageOptionsDto?: PageOptionsModel) {
    return await this.userRepository.getUsersList(pageOptionsDto);
  }

  async checkIfUserFindByEmailAndGetIt(email: string): Promise<UserModel> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      this.exceptionService.notFoundException({ message: 'User not found' });
    }
    return user;
  }

  async checkIfUserFindByPhoneNumberAndGetIt(
    phoneNumber: string,
  ): Promise<UserModel> {
    const user = await this.userRepository.getUserByPhoneNumber(phoneNumber);
    if (!user) {
      this.exceptionService.notFoundException({ message: 'User not found' });
    }
    return user;
  }

  async checkIfUserFindByIdAndGetIt(id: string): Promise<UserModel> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      this.exceptionService.notFoundException({ message: 'User not found' });
    }
    return user;
  }

  async checkIfUserFindByEmailAndPhoneNumberAndGetIt(
    email: string,
    phoneNumber: string,
  ): Promise<UserModel> {
    const user = await this.userRepository.getUserByEmailAndPhoneNumber(
      email,
      phoneNumber,
    );
    if (!user) {
      this.exceptionService.notFoundException({ message: 'User not found' });
    }
    return user;
  }

  async resetMyPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<string> {
    const user: UserModel = await this.checkIfUserFindByIdAndGetIt(id);
    const compare = await this.bcryptService.compare(
      oldPassword,
      user?.password,
    );
    if (compare) {
      const salt = await this.bcryptService.genSalt();
      const newHashPassword = await this.bcryptService.hash(newPassword, salt);
      await this.userRepository.updateUserPassword(user, newHashPassword);
      return 'Resetting password done';
    }
  }

  async resetUserPassword(id: string, newPassword: string): Promise<string> {
    const user: UserModel = await this.checkIfUserFindByIdAndGetIt(id);
    const salt = await this.bcryptService.genSalt();
    const newHashPassword = await this.bcryptService.hash(newPassword, salt);
    await this.userRepository.updateUserPassword(user, newHashPassword);
    return 'Resetting password done';
  }

  async updateMyProfile(id: string, updateUserModel: UpdateUserModel) {
    const user = await this.checkIfUserFindByIdAndGetIt(id);
    return await this.userRepository.updateUserProfile(
      user?.id,
      updateUserModel,
    );
  }

  async unAssignUserToProducts(id: string): Promise<UserModel> {
    const user: UserModel = await this.checkIfUserFindByIdAndGetIt(id);
    return await this.userRepository.unAssignUserToProducts(user);
  }

  async assignUserToProducts(
    id: string,
    productsIds: string[],
  ): Promise<UserModel> {
    let user: UserModel = await this.checkIfUserFindByIdAndGetIt(id);
    for (let i = 0; i < productsIds?.length; i++) {
      const productId = productsIds[i];
      const userProduct = user?.userProduct?.find(
        (user) => user?.product?.id === productId,
      );
      if (!userProduct) {
        user = await this.userRepository.assignUserToProducts(
          user?.id,
          productId,
        );
      }
    }
    return user;
  }

  async makeUserResponseForClient(
    userModel: UserModel,
  ): Promise<UserResponseForClientModel> {
    return new UserResponseForClientModel(userModel);
  }

  async makeUserResponseForAdmin(
    userModel: UserModel,
  ): Promise<UserResponseForAdminModel> {
    return new UserResponseForAdminModel(userModel);
  }

  async makeAllUsersResponseForAdmin(usersModel: UserModel[]) {
    const usersResponse: UserResponseForAdminModel[] = [];
    for (let i = 0; i < usersModel?.length; i++) {
      const user = usersModel[i];
      const U = await this.makeUserResponseForAdmin(user);
      usersResponse.push(U);
    }
    return usersResponse;
  }
}
