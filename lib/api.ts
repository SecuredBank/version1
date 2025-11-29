import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, ERROR_MESSAGES } from './config';
import type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Transaction,
  SecurityAlert,
  DashboardStats,
  LocationActivity,
  RiskAssessment,
  Report,
  SecuritySettings,
  SystemMonitoring,
  TransactionFilters,
  AlertFilters,
} from './types';

// API Client Class
class ApiClient {
  private mainBackendURL: string;
  private aiServiceURL: string;
  private timeout: number;

  constructor() {
    this.mainBackendURL = API_CONFIG.MAIN_BACKEND_URL;
    this.aiServiceURL = API_CONFIG.AI_SERVICE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Helper method to get auth token
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return null;
  }

  // Helper method to build headers
  private buildHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method with service selection
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useAIService = false
  ): Promise<ApiResponse<T>> {
    try {
      const baseURL = useAIService ? this.aiServiceURL : this.mainBackendURL;
      const url = `${baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.buildHeaders(),
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || ERROR_MESSAGES.SERVER_ERROR);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication Methods (Main Backend)
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  // Dashboard Methods (Main Backend)
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
  }

  // Account Methods (Main Backend)
  async getAccountStatistics(): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.ACCOUNTS.STATISTICS);
  }

  async getUserAccounts(): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.ACCOUNTS.LIST);
  }

  // Transaction Methods (Main Backend)
  async getTransactions(
    filters?: TransactionFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters as any),
    });
    return this.request<any>(`${API_ENDPOINTS.TRANSACTIONS.LIST}?${params}`) as unknown as Promise<
      PaginatedResponse<Transaction>
    >;
  }

  async getTransactionDetails(id: string): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(
      API_ENDPOINTS.TRANSACTIONS.DETAILS.replace(':id', id)
    );
  }

  // Fraud Detection Methods (AI Service)
  async analyzeFraud(transactionData: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      API_ENDPOINTS.FRAUD.ANALYZE,
      {
        method: 'POST',
        body: JSON.stringify(transactionData),
      },
      true // Use AI Service
    );
  }

  async getUserRiskProfile(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      API_ENDPOINTS.FRAUD.RISK_PROFILE.replace(':userId', userId),
      {},
      true // Use AI Service
    );
  }

  // Credit Scoring Methods (AI Service)
  async calculateCreditScore(creditData: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      API_ENDPOINTS.CREDIT.SCORE,
      {
        method: 'POST',
        body: JSON.stringify(creditData),
      },
      true // Use AI Service
    );
  }

  async assessLoanEligibility(creditData: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      API_ENDPOINTS.CREDIT.ELIGIBILITY,
      {
        method: 'POST',
        body: JSON.stringify(creditData),
      },
      true // Use AI Service
    );
  }

  // Alert Methods (Main Backend)
  async getAlerts(
    filters?: AlertFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<SecurityAlert>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters as any),
    });
    return this.request<any>(`${API_ENDPOINTS.ALERTS.LIST}?${params}`) as unknown as Promise<
      PaginatedResponse<SecurityAlert>
    >;
  }

  // Settings Methods (Main Backend)
  async getSecuritySettings(): Promise<ApiResponse<SecuritySettings>> {
    return this.request<SecuritySettings>(API_ENDPOINTS.SETTINGS.SECURITY);
  }

  async updateSecuritySettings(settings: SecuritySettings): Promise<ApiResponse<SecuritySettings>> {
    return this.request<SecuritySettings>(API_ENDPOINTS.SETTINGS.UPDATE_SECURITY, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Monitoring Methods (Main Backend)
  async getSystemMonitoring(): Promise<ApiResponse<SystemMonitoring>> {
    return this.request<SystemMonitoring>(API_ENDPOINTS.MONITORING.SYSTEM_STATUS);
  }

  async getRiskAssessment(): Promise<ApiResponse<RiskAssessment>> {
    return this.request<RiskAssessment>(API_ENDPOINTS.MONITORING.RISK_ASSESSMENT);
  }

  // Reports Methods (Main Backend)
  async getReports(): Promise<ApiResponse<Report[]>> {
    return this.request<Report[]>(API_ENDPOINTS.REPORTS.LIST);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual service methods for easier use
export const authService = {
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  register: (userData: RegisterRequest) => apiClient.register(userData),
  logout: () => apiClient.logout(),
};

export const dashboardService = {
  getStats: () => apiClient.getDashboardStats(),
};

export const transactionService = {
  getAll: (filters?: TransactionFilters, page?: number, limit?: number) =>
    apiClient.getTransactions(filters, page, limit),
  getById: (id: string) => apiClient.getTransactionDetails(id),
};

export const fraudService = {
  analyze: (transactionData: any) => apiClient.analyzeFraud(transactionData),
  getRiskProfile: (userId: string) => apiClient.getUserRiskProfile(userId),
};

export const creditService = {
  calculateScore: (creditData: any) => apiClient.calculateCreditScore(creditData),
  assessEligibility: (creditData: any) => apiClient.assessLoanEligibility(creditData),
};

export const alertService = {
  getAll: (filters?: AlertFilters, page?: number, limit?: number) =>
    apiClient.getAlerts(filters, page, limit),
};

export const settingsService = {
  getSecurity: () => apiClient.getSecuritySettings(),
  updateSecurity: (settings: SecuritySettings) => apiClient.updateSecuritySettings(settings),
};

export const monitoringService = {
  getSystemStatus: () => apiClient.getSystemMonitoring(),
  getRiskAssessment: () => apiClient.getRiskAssessment(),
};

export const accountService = {
  getStatistics: () => apiClient.getAccountStatistics(),
  getAccounts: () => apiClient.getUserAccounts(),
};