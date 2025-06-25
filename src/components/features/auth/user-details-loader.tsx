'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

import { useApiUserDetailsGet } from '@/hooks/api/useUser';

/**
 * Component tự động tải thông tin chi tiết của user khi:
 * 1. Ứng dụng khởi động và user đã đăng nhập (refresh trang)
 * 2. State isAuthenticated thay đổi (sau khi đăng nhập thành công)
 */
export function UserDetailsLoader() {
  const { isAuthenticated } = useAuthStore();
  const { refetch } = useApiUserDetailsGet();

  useEffect(() => {
    // Chỉ tải user details khi user đã đăng nhập
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  // Component này không render gì cả
  return null;
}
