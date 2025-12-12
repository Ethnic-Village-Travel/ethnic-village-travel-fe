import { userAdminApi } from '@/data/apis/user.admin.api';
import { getUserDetails } from '@/data/apis/user.api';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UpdateUserRequest, UserFilters } from '@/types/user.type';

export const useApiUserDetailsGet = () => {
  const { user } = useAuthStore();
  const { setUserDetails } = useUserStore();

  return useQuery({
    queryKey: ['user-details', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      const response = await getUserDetails();
      if (response.success && response.data) {
        setUserDetails(response.data);
      }
      return response.data;
    },
    enabled: !!user?.id,
  });
};

export const USER_ADMIN_QUERY_KEYS = {
  all: ['admin-users'] as const,
  list: (page: number, size: number, filters?: UserFilters) =>
    [...USER_ADMIN_QUERY_KEYS.all, 'list', page, size, filters] as const,
  detail: (id: string) => [...USER_ADMIN_QUERY_KEYS.all, 'detail', id] as const,
};

export const useAdminUsers = (page: number = 0, size: number = 10, filters?: UserFilters) => {
  return useQuery({
    queryKey: USER_ADMIN_QUERY_KEYS.list(page, size, filters),
    queryFn: async () => {
      const res = await userAdminApi.getUsers(page, size, filters);
      return res.data;
    },
  });
};

export const useAdminUserById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: USER_ADMIN_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const res = await userAdminApi.getUserById(id);
      return res.data;
    },
    enabled: options?.enabled ?? !!id,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateUserRequest }) => userAdminApi.updateUser(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_ADMIN_QUERY_KEYS.all });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userAdminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_ADMIN_QUERY_KEYS.all });
    },
  });
};
