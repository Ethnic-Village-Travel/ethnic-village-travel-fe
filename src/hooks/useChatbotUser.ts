'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
}

export const useChatbotUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Thử lấy thông tin user từ localStorage hoặc session
    const tryGetUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const sessionUser = sessionStorage.getItem('user');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setUserId(parsedUser.id);
          setIsGuest(false);
          return parsedUser;
        }

        if (sessionUser) {
          const parsedUser = JSON.parse(sessionUser);
          setUser(parsedUser);
          setUserId(parsedUser.id);
          setIsGuest(false);
          return parsedUser;
        }
      } catch (error) {
        console.error('Error parsing user from storage:', error);
      }
      return null;
    };

    // Thử lấy từ window object (nếu có global user state)
    const tryGetUserFromWindow = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).user) {
          const windowUser = (window as any).user;
          setUser(windowUser);
          setUserId(windowUser.id);
          setIsGuest(false);
          return windowUser;
        }
      } catch (error) {
        console.error('Error getting user from window:', error);
      }
      return null;
    };

    const foundUser = tryGetUserFromStorage() || tryGetUserFromWindow();

    if (!foundUser) {
      // Tạo guest user với ID unique
      const guestId =
        localStorage.getItem('guest_id') || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      if (!localStorage.getItem('guest_id')) {
        localStorage.setItem('guest_id', guestId);
      }

      const guestUser = { id: guestId };
      setUser(guestUser);
      setUserId(guestId);
      setIsGuest(true);
    }
  }, []);

  return {
    user,
    isGuest,
    userId,
  };
};
