export class UploadedFile {
  constructor(
    public readonly id: string,
    public readonly originalName: string,
    public readonly filename: string,
    public readonly url: string,
    public readonly mimetype: string,
    public readonly size: number,
    public readonly provider: string,
    public readonly publicId?: string,
    public readonly path?: string,
    public readonly userId?: string,
    public readonly metadata?: any,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {}
}
