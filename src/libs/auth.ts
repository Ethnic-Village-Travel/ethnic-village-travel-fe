import { useAuthStore } from '@/stores/useAuthStore';
import { deleteCookie } from '@/utils/cookie';

export const logout = () => {
  const { setAuth } = useAuthStore.getState();
  if (typeof window !== 'undefined') {
    deleteCookie('accessToken');
    deleteCookie('userRoles');
    deleteCookie('userPermissions');
    deleteCookie('userId');
  }

  setAuth({ accessToken: '', refreshToken: '', user: null });
};
