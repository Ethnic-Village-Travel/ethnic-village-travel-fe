import { User } from './user.type';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Personal {
  firstName: string;
  lastName: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
  user: User;
}
