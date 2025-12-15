import { ApiResponse } from './api.type';
import { Personal } from './auth.type';
import { Bookmark } from './bookmark.type';

export interface User {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  avatar?: string;
  personal?: UserPersonal;
}

export interface UserDetailsResponse extends ApiResponse {
  bookmarks: Bookmark[];
  pendingPaymentBookingsCount: number;
  lastUpdated: string;
}

export interface UserPersonal {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
}

export interface UserAdmin {
  id: string;
  email: string;
  active: boolean;
  personal?: UserPersonal;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  roleIds?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  active?: boolean;
  roleIds?: string[];
}

export interface UserFilters {
  search?: string;
  roleId?: string;
  active?: boolean;
}
