export const ADMIN_ACTIONS = {
  // ===== AÇÕES DE USUÁRIO =====
  PROMOTE_USER: 'promote_user',
  DEMOTE_USER: 'demote_user',
  DELETE_USER: 'delete_user',
  SUSPEND_USER: 'suspend_user',
  ACTIVATE_USER: 'activate_user',
  LIST_USERS: 'list_users',
  VIEW_USER: 'view_user',
  UPDATE_USER: 'update_user',
  CREATE_USER: 'create_user',
  RESET_USER_PASSWORD: 'reset_user_password',

  // ===== AÇÕES DE PRODUTO =====
  CREATE_PRODUCT: 'create_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',
  APPROVE_PRODUCT: 'approve_product',
  REJECT_PRODUCT: 'reject_product',
  LIST_PRODUCTS: 'list_products',
  VIEW_PRODUCT: 'view_product',
  FEATURE_PRODUCT: 'feature_product',
  UNFEATURE_PRODUCT: 'unfeature_product',

  // ===== AÇÕES DE CATEGORIA =====
  CREATE_CATEGORY: 'create_category',
  UPDATE_CATEGORY: 'update_category',
  DELETE_CATEGORY: 'delete_category',
  LIST_CATEGORIES: 'list_categories',
  VIEW_CATEGORY: 'view_category',
  REORDER_CATEGORIES: 'reorder_categories',

  // ===== CONFIGURAÇÕES DO SISTEMA =====
  UPDATE_CONFIG: 'update_config',
  VIEW_CONFIG: 'view_config',
  DELETE_CONFIG: 'delete_config',
  CREATE_CONFIG: 'create_config',
  EXPORT_CONFIG: 'export_config',
  IMPORT_CONFIG: 'import_config',

  // ===== AÇÕES DE ARQUIVO =====
  UPLOAD_FILE: 'upload_file',
  DELETE_FILE: 'delete_file',
  VIEW_FILE: 'view_file',
  UPDATE_UPLOAD_SETTINGS: 'update_upload_settings',
  BULK_DELETE_FILES: 'bulk_delete_files',

  // ===== RELATÓRIOS E AUDITORIA =====
  GENERATE_REPORT: 'generate_report',
  VIEW_LOGS: 'view_logs',
  EXPORT_DATA: 'export_data',
  VIEW_STATS: 'view_stats',
  CLEAR_LOGS: 'clear_logs',
  BACKUP_SYSTEM: 'backup_system',

  // ===== SISTEMA =====
  LOGIN: 'admin_login',
  LOGOUT: 'admin_logout',
  CHANGE_PASSWORD: 'change_password',
  UPDATE_PROFILE: 'update_profile',
  ENABLE_2FA: 'enable_2fa',
  DISABLE_2FA: 'disable_2fa',

  // ===== PEDIDOS (se aplicável) =====
  VIEW_ORDER: 'view_order',
  UPDATE_ORDER_STATUS: 'update_order_status',
  CANCEL_ORDER: 'cancel_order',
  REFUND_ORDER: 'refund_order',
  LIST_ORDERS: 'list_orders',

  // ===== MODERAÇÃO =====
  MODERATE_CONTENT: 'moderate_content',
  BAN_USER: 'ban_user',
  UNBAN_USER: 'unban_user',
  DELETE_COMMENT: 'delete_comment',
  APPROVE_COMMENT: 'approve_comment',

  // ===== NOTIFICAÇÕES =====
  SEND_NOTIFICATION: 'send_notification',
  SEND_BULK_EMAIL: 'send_bulk_email',
  CREATE_ANNOUNCEMENT: 'create_announcement',

} as const;

/**
 * Tipos de alvos para as ações administrativas
 * Define sobre que tipo de entidade a ação foi executada
 */
export const TARGET_TYPES = {
  USER: 'user',
  PRODUCT: 'product',
  CATEGORY: 'category',
  SYSTEM_CONFIG: 'system_config',
  FILE: 'file',
  REPORT: 'report',
  ORDER: 'order',
  SYSTEM: 'system',
  COMMENT: 'comment',
  NOTIFICATION: 'notification',
  ANNOUNCEMENT: 'announcement',
} as const;

/**
 * Níveis de severidade para logs administrativos
 */
export const LOG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
} as const;

/**
 * Status de ações administrativas
 */
export const ACTION_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PARTIAL: 'partial',
  PENDING: 'pending',
} as const;

/**
 * Tipos para TypeScript
 */
export type AdminAction = typeof ADMIN_ACTIONS[keyof typeof ADMIN_ACTIONS];
export type TargetType = typeof TARGET_TYPES[keyof typeof TARGET_TYPES];
export type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];
export type ActionStatus = typeof ACTION_STATUS[keyof typeof ACTION_STATUS];

/**
 * Mapeamento de ações para seus tipos de alvo
 * Ajuda a validar se a ação está sendo aplicada ao tipo correto
 */
export const ACTION_TARGET_MAP: Record<AdminAction, TargetType[]> = {
  // Ações de usuário
  [ADMIN_ACTIONS.PROMOTE_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.DEMOTE_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.DELETE_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.SUSPEND_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.ACTIVATE_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.UPDATE_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.VIEW_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.CREATE_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.RESET_USER_PASSWORD]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.BAN_USER]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.UNBAN_USER]: [TARGET_TYPES.USER],

  // Ações de produto
  [ADMIN_ACTIONS.CREATE_PRODUCT]: [TARGET_TYPES.PRODUCT],
  [ADMIN_ACTIONS.UPDATE_PRODUCT]: [TARGET_TYPES.PRODUCT],
  [ADMIN_ACTIONS.DELETE_PRODUCT]: [TARGET_TYPES.PRODUCT],
  [ADMIN_ACTIONS.APPROVE_PRODUCT]: [TARGET_TYPES.PRODUCT],
  [ADMIN_ACTIONS.REJECT_PRODUCT]: [TARGET_TYPES.PRODUCT],
  [ADMIN_ACTIONS.VIEW_PRODUCT]: [TARGET_TYPES.PRODUCT],
  [ADMIN_ACTIONS.FEATURE_PRODUCT]: [TARGET_TYPES.PRODUCT],
  [ADMIN_ACTIONS.UNFEATURE_PRODUCT]: [TARGET_TYPES.PRODUCT],

  // Ações de categoria
  [ADMIN_ACTIONS.CREATE_CATEGORY]: [TARGET_TYPES.CATEGORY],
  [ADMIN_ACTIONS.UPDATE_CATEGORY]: [TARGET_TYPES.CATEGORY],
  [ADMIN_ACTIONS.DELETE_CATEGORY]: [TARGET_TYPES.CATEGORY],
  [ADMIN_ACTIONS.VIEW_CATEGORY]: [TARGET_TYPES.CATEGORY],
  [ADMIN_ACTIONS.REORDER_CATEGORIES]: [TARGET_TYPES.CATEGORY],

  // Configurações
  [ADMIN_ACTIONS.UPDATE_CONFIG]: [TARGET_TYPES.SYSTEM_CONFIG],
  [ADMIN_ACTIONS.VIEW_CONFIG]: [TARGET_TYPES.SYSTEM_CONFIG],
  [ADMIN_ACTIONS.DELETE_CONFIG]: [TARGET_TYPES.SYSTEM_CONFIG],
  [ADMIN_ACTIONS.CREATE_CONFIG]: [TARGET_TYPES.SYSTEM_CONFIG],
  [ADMIN_ACTIONS.EXPORT_CONFIG]: [TARGET_TYPES.SYSTEM_CONFIG],
  [ADMIN_ACTIONS.IMPORT_CONFIG]: [TARGET_TYPES.SYSTEM_CONFIG],

  // Arquivos
  [ADMIN_ACTIONS.UPLOAD_FILE]: [TARGET_TYPES.FILE],
  [ADMIN_ACTIONS.DELETE_FILE]: [TARGET_TYPES.FILE],
  [ADMIN_ACTIONS.VIEW_FILE]: [TARGET_TYPES.FILE],
  [ADMIN_ACTIONS.BULK_DELETE_FILES]: [TARGET_TYPES.FILE],

  // Sistema
  [ADMIN_ACTIONS.LOGIN]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.LOGOUT]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.CHANGE_PASSWORD]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.UPDATE_PROFILE]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.ENABLE_2FA]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.DISABLE_2FA]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.BACKUP_SYSTEM]: [TARGET_TYPES.SYSTEM],

  // Ações sem alvo específico ou múltiplos alvos
  [ADMIN_ACTIONS.LIST_USERS]: [TARGET_TYPES.USER],
  [ADMIN_ACTIONS.LIST_PRODUCTS]: [TARGET_TYPES.PRODUCT],
  [ADMIN_ACTIONS.LIST_CATEGORIES]: [TARGET_TYPES.CATEGORY],
  [ADMIN_ACTIONS.LIST_ORDERS]: [TARGET_TYPES.ORDER],
  [ADMIN_ACTIONS.UPDATE_UPLOAD_SETTINGS]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.GENERATE_REPORT]: [TARGET_TYPES.REPORT],
  [ADMIN_ACTIONS.VIEW_LOGS]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.EXPORT_DATA]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.VIEW_STATS]: [TARGET_TYPES.SYSTEM],
  [ADMIN_ACTIONS.CLEAR_LOGS]: [TARGET_TYPES.SYSTEM],

  // Pedidos
  [ADMIN_ACTIONS.VIEW_ORDER]: [TARGET_TYPES.ORDER],
  [ADMIN_ACTIONS.UPDATE_ORDER_STATUS]: [TARGET_TYPES.ORDER],
  [ADMIN_ACTIONS.CANCEL_ORDER]: [TARGET_TYPES.ORDER],
  [ADMIN_ACTIONS.REFUND_ORDER]: [TARGET_TYPES.ORDER],

  // Moderação
  [ADMIN_ACTIONS.MODERATE_CONTENT]: [TARGET_TYPES.COMMENT, TARGET_TYPES.PRODUCT, TARGET_TYPES.USER],
  [ADMIN_ACTIONS.DELETE_COMMENT]: [TARGET_TYPES.COMMENT],
  [ADMIN_ACTIONS.APPROVE_COMMENT]: [TARGET_TYPES.COMMENT],

  // Notificações
  [ADMIN_ACTIONS.SEND_NOTIFICATION]: [TARGET_TYPES.NOTIFICATION],
  [ADMIN_ACTIONS.SEND_BULK_EMAIL]: [TARGET_TYPES.NOTIFICATION],
  [ADMIN_ACTIONS.CREATE_ANNOUNCEMENT]: [TARGET_TYPES.ANNOUNCEMENT],
};

/**
 * Descrições amigáveis para as ações
 */
export const ACTION_DESCRIPTIONS: Record<AdminAction, string> = {
  [ADMIN_ACTIONS.PROMOTE_USER]: 'Promoção de usuário',
  [ADMIN_ACTIONS.DEMOTE_USER]: 'Rebaixamento de usuário',
  [ADMIN_ACTIONS.DELETE_USER]: 'Exclusão de usuário',
  [ADMIN_ACTIONS.SUSPEND_USER]: 'Suspensão de usuário',
  [ADMIN_ACTIONS.ACTIVATE_USER]: 'Ativação de usuário',
  [ADMIN_ACTIONS.LIST_USERS]: 'Listagem de usuários',
  [ADMIN_ACTIONS.VIEW_USER]: 'Visualização de usuário',
  [ADMIN_ACTIONS.UPDATE_USER]: 'Atualização de usuário',
  [ADMIN_ACTIONS.CREATE_USER]: 'Criação de usuário',
  [ADMIN_ACTIONS.RESET_USER_PASSWORD]: 'Reset de senha de usuário',
  [ADMIN_ACTIONS.BAN_USER]: 'Banimento de usuário',
  [ADMIN_ACTIONS.UNBAN_USER]: 'Desbanimento de usuário',

  [ADMIN_ACTIONS.CREATE_PRODUCT]: 'Criação de produto',
  [ADMIN_ACTIONS.UPDATE_PRODUCT]: 'Atualização de produto',
  [ADMIN_ACTIONS.DELETE_PRODUCT]: 'Exclusão de produto',
  [ADMIN_ACTIONS.APPROVE_PRODUCT]: 'Aprovação de produto',
  [ADMIN_ACTIONS.REJECT_PRODUCT]: 'Rejeição de produto',
  [ADMIN_ACTIONS.LIST_PRODUCTS]: 'Listagem de produtos',
  [ADMIN_ACTIONS.VIEW_PRODUCT]: 'Visualização de produto',
  [ADMIN_ACTIONS.FEATURE_PRODUCT]: 'Destacar produto',
  [ADMIN_ACTIONS.UNFEATURE_PRODUCT]: 'Remover destaque do produto',

  [ADMIN_ACTIONS.CREATE_CATEGORY]: 'Criação de categoria',
  [ADMIN_ACTIONS.UPDATE_CATEGORY]: 'Atualização de categoria',
  [ADMIN_ACTIONS.DELETE_CATEGORY]: 'Exclusão de categoria',
  [ADMIN_ACTIONS.LIST_CATEGORIES]: 'Listagem de categorias',
  [ADMIN_ACTIONS.VIEW_CATEGORY]: 'Visualização de categoria',
  [ADMIN_ACTIONS.REORDER_CATEGORIES]: 'Reordenação de categorias',

  [ADMIN_ACTIONS.UPDATE_CONFIG]: 'Atualização de configuração',
  [ADMIN_ACTIONS.VIEW_CONFIG]: 'Visualização de configuração',
  [ADMIN_ACTIONS.DELETE_CONFIG]: 'Exclusão de configuração',
  [ADMIN_ACTIONS.CREATE_CONFIG]: 'Criação de configuração',
  [ADMIN_ACTIONS.EXPORT_CONFIG]: 'Exportação de configuração',
  [ADMIN_ACTIONS.IMPORT_CONFIG]: 'Importação de configuração',

  [ADMIN_ACTIONS.UPLOAD_FILE]: 'Upload de arquivo',
  [ADMIN_ACTIONS.DELETE_FILE]: 'Exclusão de arquivo',
  [ADMIN_ACTIONS.VIEW_FILE]: 'Visualização de arquivo',
  [ADMIN_ACTIONS.UPDATE_UPLOAD_SETTINGS]: 'Atualização de configurações de upload',
  [ADMIN_ACTIONS.BULK_DELETE_FILES]: 'Exclusão em lote de arquivos',

  [ADMIN_ACTIONS.GENERATE_REPORT]: 'Geração de relatório',
  [ADMIN_ACTIONS.VIEW_LOGS]: 'Visualização de logs',
  [ADMIN_ACTIONS.EXPORT_DATA]: 'Exportação de dados',
  [ADMIN_ACTIONS.VIEW_STATS]: 'Visualização de estatísticas',
  [ADMIN_ACTIONS.CLEAR_LOGS]: 'Limpeza de logs',
  [ADMIN_ACTIONS.BACKUP_SYSTEM]: 'Backup do sistema',

  [ADMIN_ACTIONS.LOGIN]: 'Login administrativo',
  [ADMIN_ACTIONS.LOGOUT]: 'Logout administrativo',
  [ADMIN_ACTIONS.CHANGE_PASSWORD]: 'Alteração de senha',
  [ADMIN_ACTIONS.UPDATE_PROFILE]: 'Atualização de perfil',
  [ADMIN_ACTIONS.ENABLE_2FA]: 'Ativação de autenticação 2FA',
  [ADMIN_ACTIONS.DISABLE_2FA]: 'Desativação de autenticação 2FA',

  [ADMIN_ACTIONS.VIEW_ORDER]: 'Visualização de pedido',
  [ADMIN_ACTIONS.UPDATE_ORDER_STATUS]: 'Atualização de status do pedido',
  [ADMIN_ACTIONS.CANCEL_ORDER]: 'Cancelamento de pedido',
  [ADMIN_ACTIONS.REFUND_ORDER]: 'Reembolso de pedido',
  [ADMIN_ACTIONS.LIST_ORDERS]: 'Listagem de pedidos',

  [ADMIN_ACTIONS.MODERATE_CONTENT]: 'Moderação de conteúdo',
  [ADMIN_ACTIONS.DELETE_COMMENT]: 'Exclusão de comentário',
  [ADMIN_ACTIONS.APPROVE_COMMENT]: 'Aprovação de comentário',

  [ADMIN_ACTIONS.SEND_NOTIFICATION]: 'Envio de notificação',
  [ADMIN_ACTIONS.SEND_BULK_EMAIL]: 'Envio de email em massa',
  [ADMIN_ACTIONS.CREATE_ANNOUNCEMENT]: 'Criação de anúncio',
};

/**
 * Função utilitária para validar se uma ação é válida para um tipo de alvo
 */
export function isValidActionForTarget(action: AdminAction, targetType: TargetType): boolean {
  const validTargets = ACTION_TARGET_MAP[action];
  return validTargets ? validTargets.includes(targetType) : false;
}

/**
 * Função utilitária para obter a descrição de uma ação
 */
export function getActionDescription(action: AdminAction): string {
  return ACTION_DESCRIPTIONS[action] || action;
}