import { authApi } from '@/apis/auth.api';
import { useMutation } from '@tanstack/react-query';

import { LoginRequest } from '@/types/auth.type';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });
};
