import { getUserDetails } from '@/data/apis/user.api';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useQuery } from '@tanstack/react-query';

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
