import { FileModel } from './file.model';

export class FileResponseModel {
  url: string;
  type: string;

  constructor(file: FileModel) {
    this.url = file?.url;
    this.type = file?.type;
  }
}
