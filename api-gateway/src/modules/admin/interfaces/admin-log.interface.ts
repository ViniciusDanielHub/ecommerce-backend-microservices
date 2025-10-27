export interface LogAdminActionData {
  adminId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  description: string;
  metadata?: any;
  ip?: string;
  userAgent?: string;
}

/**
 * Interface para filtros de consulta de logs administrativos
 */
export interface AdminLogFilters {
  adminId?: string;
  action?: string;
  targetType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  includeAdmin?: boolean;
}

/**
 * Interface para estatísticas de ações administrativas
 */
export interface AdminActionStats {
  totalActions: number;
  actionStats: {
    action: string;
    count: number;
  }[];
  adminStats: {
    adminId: string;
    count: number;
  }[];
}

/**
 * Interface para estatísticas diárias
 */
export interface DailyActionStats {
  [date: string]: {
    [action: string]: number;
  };
}

/**
 * Interface para atividade recente de admin
 */
export interface AdminRecentActivity {
  id: string;
  action: string;
  targetType?: string;
  description: string;
  createdAt: Date;
  metadata?: any;
}

/**
 * Interface para configuração do sistema
 */
export interface SystemConfig {
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

