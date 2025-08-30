export interface FileConfig {
  port: number;
  serviceName: string;
  microservicePort: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
  };
  upload: {
    provider: string;
    maxFileSize: number;
    allowedFormats: string[];
    localPath: string;
    localBaseUrl: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  aws: {
    region: string;
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  services: {
    adminService: string;
  };
}

export const fileConfig = (): FileConfig => ({
  port: parseInt(process.env.SERVICE_PORT, 10) || 3006,
  serviceName: process.env.SERVICE_NAME || 'file-service',
  microservicePort: parseInt(process.env.MICROSERVICE_PORT, 10) || 8006,
  database: {
    url: process.env.FILE_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/file_service',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
  },
  upload: {
    provider: process.env.UPLOAD_PROVIDER || 'LOCAL',
    maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE, 10) || 5242880,
    allowedFormats: process.env.UPLOAD_ALLOWED_FORMATS?.split(',') || ['jpg', 'jpeg', 'png', 'webp'],
    localPath: process.env.LOCAL_UPLOAD_PATH || 'uploads/products',
    localBaseUrl: process.env.LOCAL_UPLOAD_BASE_URL || 'http://localhost:3006',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  aws: {
    region: process.env.AWS_REGION || '',
    bucketName: process.env.AWS_BUCKET_NAME || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  services: {
    adminService: process.env.ADMIN_SERVICE_URL || 'http://admin-service:3003',
  },
});
