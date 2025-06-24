import { useAuthStore } from '@/store/useAuthStore';

export const logout = () => {
  const { setAuth } = useAuthStore.getState();
  setAuth({ accessToken: '', refreshToken: '', user: null });
};
