import { tourAssignmentApi } from '@/apis/tour-assignment.api';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { TourAssignmentRequest } from '@/types/tour-assignment.type';

export const useAssignTourEmployees = () => {
  return useMutation({
    mutationFn: (payload: TourAssignmentRequest) => tourAssignmentApi.assign(payload),
  });
};

export const useTourAssignments = (payload: any) => {
  return useQuery({
    queryKey: ['tour-assignments', payload],
    queryFn: () => tourAssignmentApi.search(payload),
    enabled: !!payload,
  });
};
