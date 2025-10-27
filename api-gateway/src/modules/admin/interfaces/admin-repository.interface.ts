import {
  LogAdminActionData,
  AdminLogFilters,
  AdminActionStats,
  DailyActionStats,
  AdminRecentActivity,
  SystemConfig
} from './admin-log.interface';

/**
 * Interface do repositório administrativo
 */
export interface IAdminRepository {
  // Métodos de log
  logAdminAction(data: LogAdminActionData): Promise<void>;
  getAdminLogs(filters?: AdminLogFilters): Promise<any[]>;
  countAdminLogs(filters?: AdminLogFilters): Promise<number>;
  getLogsByAdmin(adminId: string, limit?: number): Promise<any[]>;
  getLogsByAction(action: string, limit?: number): Promise<any[]>;
  getRecentLogs(limit?: number): Promise<any[]>;
  getLogsByDateRange(startDate: Date, endDate: Date, limit?: number): Promise<any[]>;
  getLogsByActions(actions: string[], limit?: number): Promise<any[]>;

  // Métodos de configuração
  getSystemConfig(key: string): Promise<string | null>;
  setSystemConfig(key: string, value: string): Promise<void>;
  getAllSystemConfigs(): Promise<SystemConfig[]>;
  deleteSystemConfig(key: string): Promise<void>;

  // Métodos de estatísticas
  getActionStats(startDate?: Date, endDate?: Date): Promise<AdminActionStats>;
  getAdminRecentActivity(adminId: string, limit?: number): Promise<AdminRecentActivity[]>;
  getDailyActionStats(days?: number): Promise<DailyActionStats>;
}