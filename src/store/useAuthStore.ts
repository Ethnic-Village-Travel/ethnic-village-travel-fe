import { setCookie } from '@/utils/cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types/auth.type';

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: User | null;
  isAuthenticated: boolean;
  loginOpen: boolean;
  signupOpen: boolean;
  forgotPasswordOpen: boolean;
  enterOtpOpen: boolean;
  otpEmail: string;
  setAuth: (data: { accessToken: string; refreshToken: string; user: User | null }) => void;
  setLoginOpen: (open: boolean) => void;
  setSignupOpen: (open: boolean) => void;
  setForgotPasswordOpen: (open: boolean) => void;
  setEnterOtpOpen: (open: boolean) => void;
  setOtpEmail: (email: string) => void;
  closeAllPopups: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: '',
      refreshToken: '',
      user: null,
      isAuthenticated: false,
      loginOpen: false,
      signupOpen: false,
      forgotPasswordOpen: false,
      enterOtpOpen: false,
      otpEmail: '',
      setAuth: ({ accessToken, refreshToken, user }) => {
        // Set cookies cho middleware
        if (typeof window !== 'undefined') {
          setCookie('accessToken', accessToken, 1);
          setCookie('refreshToken', refreshToken, 7);
          setCookie('userRoles', JSON.stringify(user?.roles || []), 7);
          setCookie('userPermissions', JSON.stringify(user?.permissions || []), 7);
          setCookie('userId', user?.id?.toString() || '', 7);
        }

        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: !!accessToken && !!user,
        });
      },

      setLoginOpen: open => set({ loginOpen: open }),
      setSignupOpen: open => set({ signupOpen: open }),
      setForgotPasswordOpen: open => set({ forgotPasswordOpen: open }),
      setEnterOtpOpen: open => set({ enterOtpOpen: open }),
      setOtpEmail: email => set({ otpEmail: email }),
      closeAllPopups: () =>
        set({
          loginOpen: false,
          signupOpen: false,
          forgotPasswordOpen: false,
          enterOtpOpen: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
