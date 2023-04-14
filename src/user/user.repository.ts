import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { UserModel } from './models/user.model';
import { UpdateUserModel } from './models/update-user.model';
import { UserRole } from './models/user-role.enum';
import { SignupUserModel } from 'src/auth/models/signup-user.model';
import { PageOptionsModel } from 'src/common/pagination/models/page-options.model';
import { PageMetaDto } from 'src/common/pagination/dto/pagination-meta.dto';
import { PageMetaModel } from 'src/common/pagination/models/page-meta.model';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAdminUser(createUserModel: SignupUserModel): Promise<void> {
    const existUser: UserModel = await this.getUserByEmail(
      createUserModel?.email,
    );
    if (!existUser) {
      await this.prismaService.user.create({
        data: {
          firstName: createUserModel?.firstName,
          lastName: createUserModel?.lastName,
          email: createUserModel?.email?.toLowerCase(),
          password: createUserModel?.password,
          isVerified: true,
          userRole: UserRole.Admin,
        },
      });
    }
  }

  async createNewUser(createUserModel: SignupUserModel): Promise<UserModel> {
    return await this.prismaService.user.create({
      data: {
        firstName: createUserModel?.firstName,
        lastName: createUserModel?.lastName,
        email: createUserModel?.email?.toLowerCase(),
        phoneNumber: createUserModel?.phoneNumber,
        password: createUserModel?.password,
        isVerified: false,
        userRole: UserRole.User,
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getUsersList(pageOptionsDto?: PageOptionsModel): Promise<{
    response: UserModel[];
    unVerifiedUsersCount: number;
    meta: PageMetaModel;
  }> {
    const users = await this.prismaService.user.findMany({
      skip: pageOptionsDto?.skip,
      take: pageOptionsDto?.limit,
      orderBy: {
        createdAt: pageOptionsDto?.order,
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });

    const itemCount = await this.prismaService.user.count({});

    const unVerifiedCount = await this.prismaService.user.count({
      where: {
        isVerified: false,
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount,
    });

    return {
      response: users,
      unVerifiedUsersCount: unVerifiedCount,
      meta: pageMetaDto,
    };
  }

  async getUserById(id: string): Promise<UserModel> {
    return await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    return await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<UserModel> {
    return await this.prismaService.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getUserByEmailAndPhoneNumber(
    email: string,
    phoneNumber: string,
  ): Promise<UserModel> {
    return await this.prismaService.user.findFirst({
      where: {
        AND: {
          email: email,
          phoneNumber: phoneNumber,
        },
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateUserProfile(
    id: string,
    updateUserModel: UpdateUserModel,
  ): Promise<UserModel> {
    return await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        firstName: updateUserModel?.firstName,
        lastName: updateUserModel?.lastName,
        email: updateUserModel?.email?.toLowerCase(),
        phoneNumber: updateUserModel?.phoneNumber,
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async unAssignUserToProducts(user: UserModel): Promise<UserModel> {
    return await this.prismaService.user.update({
      where: {
        id: user?.id,
      },
      data: {
        userProduct: {
          deleteMany: {
            userId: user?.id,
          },
        },
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async assignUserToProducts(
    id: string,
    productId: string,
  ): Promise<UserModel> {
    return await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        userProduct: {
          create: {
            productId: productId,
          },
        },
      },
      include: {
        userProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateUserPassword(
    userModel: UserModel,
    newPassword: string,
  ): Promise<UserModel> {
    return await this.prismaService.user.update({
      where: {
        id: userModel?.id,
      },
      data: {
        password: newPassword,
      },
    });
  }

  async updateOTPCode(
    userModel: UserModel,
    otpCode: number,
  ): Promise<{ user: UserModel; otpCode: number }> {
    const user = await this.prismaService.user.update({
      where: {
        id: userModel?.id,
      },
      data: {
        otpCode: otpCode,
        otpCodeExpireDate: Date.now(),
      },
    });
    return {
      user: user,
      otpCode: user?.otpCode,
    };
  }

  async saveOTPCodeAndExpireDate(
    userModel: UserModel,
    otpCode: number,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userModel?.id,
      },
      data: {
        otpCode: otpCode,
        otpCodeExpireDate: Date.now(),
      },
    });
  }

  async verifyUser(userModel: UserModel): Promise<UserModel> {
    return await this.prismaService.user.update({
      where: {
        id: userModel?.id,
      },
      data: {
        isVerified: true,
        otpCode: null,
        otpCodeExpireDate: null,
      },
    });
  }

  async updateRefreshToken(
    userModel: UserModel,
    refreshToken: string,
  ): Promise<UserModel> {
    return await this.prismaService.user.update({
      where: {
        id: userModel?.id,
      },
      data: {
        hashRefreshToken: refreshToken,
      },
    });
  }

  async updateLastLogin(userModel: UserModel): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userModel?.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }
}
