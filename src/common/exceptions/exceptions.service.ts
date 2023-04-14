import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { IFormatExceptionMessage } from './interfaces/exceptions.interface';

@Injectable()
export class ExceptionsService {
  badRequestException(data: IFormatExceptionMessage): void {
    throw new BadRequestException(data);
  }
  internalServerErrorException(data?: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }
  forbiddenException(data?: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }
  unauthorizedException(data?: IFormatExceptionMessage): void {
    throw new UnauthorizedException(data);
  }
  notFoundException(data?: IFormatExceptionMessage): void {
    throw new NotFoundException(data);
  }
  unsupportedMediaTypeException(data?: IFormatExceptionMessage): void {
    throw new UnsupportedMediaTypeException(data);
  }
}
