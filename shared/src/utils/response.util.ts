export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export class ResponseUtil {
  static success<T>(data?: T, message = 'Operação realizada com sucesso'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date()
    };
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
      timestamp: new Date()
    };
  }

  static paginated<T>(
    data: T[], 
    total: number, 
    page: number, 
    limit: number, 
    message = 'Dados paginados recuperados com sucesso'
  ): PaginatedResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      message,
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      },
      timestamp: new Date()
    };
  }
}
