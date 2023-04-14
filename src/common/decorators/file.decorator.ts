import {
  applyDecorators,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_MANAGER } from '../files/models/folder-keys';
import * as fs from 'fs';

export const File = (fieldName: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: function (req, file, cb) {
            const { uploadFileFor } = req.query;
            const base_path = 'public/my-uploads/';
            let file_path = base_path;
            // Folder Paths
            switch (uploadFileFor) {
              case FILE_MANAGER.FILE_STORAGE_KEY_PATHS.PRODUCT_IMAGE.KEY: {
                file_path +=
                  FILE_MANAGER.FILE_STORAGE_KEY_PATHS.PRODUCT_IMAGE.PATH;
                break;
              }
              default: {
                break;
              }
            }
            if (!fs.existsSync(file_path)) {
              fs.mkdirSync(file_path, {
                recursive: true,
              });
            }
            cb(null, file_path);
          },
          filename: function (req, file, cb) {
            const uniqueSuffix: string =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + '_' + file.originalname);
          },
        }),
        fileFilter: function (req, file, cb) {
          if (
            !file.originalname
              .toLowerCase()
              .match(/\.(jpg|jpeg|png|webp|ico|svg|bmp|tif|tiff)$/)
          ) {
            return cb(
              new BadRequestException({
                message: `Only image or icon files are allowed`,
              }),
              false,
            );
          }
          cb(null, true);
        },
      }),
    ),
  );
};
