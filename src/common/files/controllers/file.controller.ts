import {
  Body,
  Controller,
  Delete,
  ParseFilePipe,
  Post,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFile } from '../../decorators/api-file.decorator';
import { Auth } from '../../decorators/auth.decorator';
import { MaxFileSizeValidator } from '../../pipe/file-filter.pipe';
import { DeleteFileDto } from '../dto/file.dto';
import { FileService } from '../file.service';
import { File } from 'src/common/decorators/file.decorator';
import { FileResponseDto } from '../dto/file-response.dto';
import { FileResponseModel } from '../models/file.response';

@Controller('upload')
@Auth()
@ApiTags('Files Upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload-file')
  @ApiFile('file', true)
  @ApiOperation({ summary: 'Upload File', description: 'Upload File' })
  @ApiOkResponse({ type: FileResponseDto })
  @ApiQuery({ name: 'uploadFileFor', required: false })
  @File('file')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 20000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    // We can use S3 Bucket (Cloud storage) on AWS insted of local storage

    const fileModel = {
      url: file?.path,
      type: file?.mimetype,
    };
    return new FileResponseModel(fileModel);
  }

  @Delete('delete-file')
  @ApiOperation({ summary: 'Delete File', description: 'Delete File' })
  async deleteFile(@Body() deleteFileDto: DeleteFileDto) {
    return await this.fileService.deleteFile(deleteFileDto?.url);
  }
}
