export interface LoginRequest {
  email: string;
  password: string;
}

export interface Personal {
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface User {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  avatar?: string;
  personal?: Personal;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
  user: User;
}
