export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Resposta específica do user-service para atualização de role
export interface UserRoleUpdateData {
  userId: string;
  previousRole: string; // Role anterior (antes da mudança)
  newRole: string;      // Role nova (depois da mudança)
  user: {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  changed: boolean;     // Se houve mudança real
}

export type UserRoleUpdateResponse = ApiResponse<UserRoleUpdateData>;

// Resposta para listagem de usuários
export interface UserListData {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserListResponse = ApiResponse<UserListData[]>;