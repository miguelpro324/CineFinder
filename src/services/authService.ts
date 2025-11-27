// API base URL - Dynamically use current host or environment variable
const getApiBaseUrl = () => {
  // If VITE_API_BASE_URL is set and not localhost, use it
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  
  // Otherwise, use the current window location host with port 5000
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5000/api`;
};

const API_BASE_URL = getApiBaseUrl();

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  userId?: number;
}

export interface CheckResponse {
  success: boolean;
  exists: boolean;
}

export const authService = {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register user');
    }
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login');
    }
  },

  // Check if username exists
  async checkUsername(username: string): Promise<CheckResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-username/${encodeURIComponent(username)}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Check username error:', error);
      throw new Error('Failed to check username');
    }
  },

  // Check if email exists
  async checkEmail(email: string): Promise<CheckResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email/${encodeURIComponent(email)}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Check email error:', error);
      throw new Error('Failed to check email');
    }
  },
};
