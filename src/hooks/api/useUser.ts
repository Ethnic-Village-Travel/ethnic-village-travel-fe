import { getUserDetails } from '@/apis/user.api';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export const useApiUserDetailsGet = () => {
  const { user, setUserDetails } = useAuthStore();

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
