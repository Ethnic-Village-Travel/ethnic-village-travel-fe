import { tourApi, TourListParams } from '@/apis/tour.api';
import { useQuery } from '@tanstack/react-query';

export const useTourList = (params: TourListParams) => {
  return useQuery({
    queryKey: ['tour-list', params],
    queryFn: () => tourApi.getTourList(params),
  });
};
