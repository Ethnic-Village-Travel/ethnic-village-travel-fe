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
  personal?: Personal;
}

export interface UserDetailsResponse extends ApiResponse {
  bookmarks: Bookmark[];
  pendingPaymentBookingsCount: number;
  // notifications: Notification[];
  lastUpdated: string;
}
