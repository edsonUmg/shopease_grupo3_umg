export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'customer' | 'manager';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  expiresIn: number;
  message?: string;
}

export interface LoginData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}