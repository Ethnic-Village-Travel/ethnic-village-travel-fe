import { ethnicApi } from '@/apis/ethnic.api';
import { useQuery } from '@tanstack/react-query';

export const useEthnicList = () => {
  return useQuery({
    queryKey: ['ethnic-list'],
    queryFn: () => ethnicApi.getEthnicAll(),
  });
};
