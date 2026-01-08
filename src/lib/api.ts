/**
 * API Service Layer for Django Backend
 * Handles all API calls to the Django REST Framework backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://visa.up.railway.app/api';

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token refresh on 401
  if (response.status === 401 && getRefreshToken()) {
    try {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${getToken()}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });
        if (!retryResponse.ok) {
          throw new Error(`API error: ${retryResponse.statusText}`);
        }
        return retryResponse.json();
      }
    } catch (error) {
      // Refresh failed, clear tokens and redirect to login
      clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || error.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  /**
   * Register a new user
   */
  register: async (data: {
    email: string;
    username: string;
    password: string;
    re_password: string;
    full_name?: string;
    phone?: string;
  }) => {
    const response = await apiRequest<{ email: string }>('/auth/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * Login and get JWT tokens
   */
  login: async (email: string, password: string) => {
    const response = await apiRequest<{ access: string; refresh: string }>('/auth/token/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(response.access, response.refresh);
    return response;
  },

  /**
   * Logout (blacklist refresh token)
   */
  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await apiRequest('/auth/token/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    clearTokens();
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await apiRequest<{ access: string }>('/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const currentRefresh = getRefreshToken();
      if (currentRefresh) {
        setTokens(response.access, currentRefresh);
      }
      return true;
    } catch (error) {
      clearTokens();
      return false;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    return apiRequest('/auth/users/me/');
  },

  /**
   * Activate user account (email verification)
   */
  activate: async (uid: string, token: string) => {
    return apiRequest('/auth/users/activation/', {
      method: 'POST',
      body: JSON.stringify({ uid, token }),
    });
  },

  /**
   * Resend activation email
   */
  resendActivation: async (email: string) => {
    return apiRequest('/auth/users/resend_activation/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Request password reset
   */
  resetPassword: async (email: string) => {
    return apiRequest('/auth/users/reset_password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Confirm password reset
   */
  confirmPasswordReset: async (uid: string, token: string, new_password: string) => {
    return apiRequest('/auth/users/reset_password_confirm/', {
      method: 'POST',
      body: JSON.stringify({ uid, token, new_password }),
    });
  },
};

// Refresh access token helper
async function refreshAccessToken(): Promise<boolean> {
  return authAPI.refreshToken();
}

// Interviews API
export const interviewsAPI = {
  /**
   * Get all interviews for current user
   */
  list: async () => {
    return apiRequest<Array<{
      id: string;
      interview_type: string;
      status: string;
      started_at: string;
      ended_at: string | null;
      decision: string | null;
      score: number | null;
    }>>('/v1/interviews/');
  },

  /**
   * Get a specific interview
   */
  get: async (id: string) => {
    return apiRequest(`/v1/interviews/${id}/`);
  },

  /**
   * Get conversation token for ElevenLabs
   */
  getConversationToken: async (agentId: string, interviewType: string) => {
    return apiRequest<{
      token: string;
      conversation_id: string;
      interview_id: string;
    }>('/v1/voice/conversation_token/', {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        interview_type: interviewType,
      }),
    });
  },

  /**
   * Analyze interview and get results
   */
  analyze: async (interviewId: string) => {
    return apiRequest<{
      id: string;
      interview_type: string;
      status: string;
      decision: string;
      feedback: Record<string, unknown>;
      score: number;
      started_at: string;
      ended_at: string;
    }>(`/v1/interviews/${interviewId}/analyze/`, {
      method: 'POST',
      body: JSON.stringify({ type: 'visa' }),
    });
  },

  /**
   * Get interview result
   */
  getResult: async (interviewId: string) => {
    return apiRequest(`/v1/interviews/${interviewId}/result/`);
  },
};

// Subscriptions API
export const subscriptionsAPI = {
  /**
   * Get current subscription
   */
  getCurrent: async () => {
    return apiRequest<{
      plan: string;
      status: string;
      current_period_start: string | null;
      current_period_end: string | null;
      cancel_at_period_end: boolean;
    }>('/v1/subscription/current/');
  },

  /**
   * Create a new subscription
   */
  create: async (plan: 'starter' | 'professional') => {
    return apiRequest('/v1/subscription/create_subscription/', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  },

  /**
   * Cancel subscription
   */
  cancel: async () => {
    return apiRequest('/v1/subscription/cancel/', {
      method: 'POST',
    });
  },

  /**
   * Get usage information
   */
  getUsage: async () => {
    return apiRequest<{
      interview_count: number;
      limit: number | 'unlimited';
      plan: string;
      can_start_interview: boolean;
      remaining: number | 'unlimited';
    }>('/v1/usage/info/');
  },
};

// Export token management functions
export { getToken, clearTokens, setTokens };

