import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../../infrastructure/repositories/admin.repository';

@Injectable()
export class ManageSystemConfigUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getConfig(key: string): Promise<string | null> {
    return this.adminRepository.getSystemConfig(key);
  }

  async setConfig(
    adminId: string,
    key: string,
    value: string,
    description?: string,
  ): Promise<void> {
    await this.adminRepository.setSystemConfig(key, value);

    // Log da ação administrativa
    await this.adminRepository.logAdminAction({
      adminId,
      action: 'update_config',
      targetId: key,
      targetType: 'system_config',
      description: description || `Configuração ${key} atualizada`,
      metadata: { key, value },
    });
  }

  async getDefaultStoreName(): Promise<string> {
    const name = await this.adminRepository.getSystemConfig('DEFAULT_STORE_NAME');
    return name || 'Minha Loja';
  }

  async setDefaultStoreName(adminId: string, name: string): Promise<void> {
    await this.setConfig(adminId, 'DEFAULT_STORE_NAME', name, 'Nome padrão da loja atualizado');
  }

  async getUploadConfig(): Promise<{
    provider: string;
    maxFileSize: string;
    allowedFormats: string;
  }> {
    const [provider, maxFileSize, allowedFormats] = await Promise.all([
      this.adminRepository.getSystemConfig('UPLOAD_PROVIDER'),
      this.adminRepository.getSystemConfig('UPLOAD_MAX_FILE_SIZE'),
      this.adminRepository.getSystemConfig('UPLOAD_ALLOWED_FORMATS'),
    ]);

    return {
      provider: provider || 'LOCAL',
      maxFileSize: maxFileSize || '5242880',
      allowedFormats: allowedFormats || 'jpg,jpeg,png,webp',
    };
  }

  async setUploadConfig(
    adminId: string,
    provider: string,
    maxFileSize: string,
    allowedFormats: string,
  ): Promise<void> {
    await Promise.all([
      this.setConfig(adminId, 'UPLOAD_PROVIDER', provider),
      this.setConfig(adminId, 'UPLOAD_MAX_FILE_SIZE', maxFileSize),
      this.setConfig(adminId, 'UPLOAD_ALLOWED_FORMATS', allowedFormats),
    ]);
  }
}
