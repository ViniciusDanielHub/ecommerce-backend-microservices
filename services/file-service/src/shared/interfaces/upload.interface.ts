export interface UploadResult {
  id: string;
  url: string;
  publicId?: string;
  originalName: string;
  filename: string;
  size: number;
  mimetype: string;
  provider: string;
}

export interface IUploadProvider {
  uploadSingle(file: Express.Multer.File): Promise<UploadResult>;
  uploadMultiple(files: Express.Multer.File[]): Promise<UploadResult[]>;
  delete(publicId: string): Promise<void>;
  getUrl(publicId: string): string;
}
