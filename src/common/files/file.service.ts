import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async deleteFile(path: string): Promise<void> {
    try {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    } catch (error) {
      throw error;
    }
  }
}
