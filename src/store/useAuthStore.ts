import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types/auth.type';

export type AuthPopupType = 'login' | 'signup' | 'forgot-password' | 'enter-otp';

interface AuthState {
  accessToken: string | null;
  tokenType: string | null;
  expiresAt: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isOpen: boolean;
  currentPopup: AuthPopupType;
  email: string;
  setAuth: (data: { accessToken: string; tokenType: string; expiresAt: string; user: User }) => void;
  logout: () => void;
  setOpen: (isOpen: boolean) => void;
  setCurrentPopup: (popup: AuthPopupType) => void;
  setEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      tokenType: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
      isOpen: false,
      currentPopup: 'login',
      email: '',
      setAuth: data =>
        set({
          accessToken: data.accessToken,
          tokenType: data.tokenType,
          expiresAt: data.expiresAt,
          user: data.user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          accessToken: null,
          tokenType: null,
          expiresAt: null,
          user: null,
          isAuthenticated: false,
        }),
      setOpen: isOpen => set({ isOpen }),
      setCurrentPopup: popup => set({ currentPopup: popup }),
      setEmail: email => set({ email }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
