import { API } from '@/core/api';
import api from '@/core/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Bookmark } from '@/types/bookmark.type';

// Get bookmark status
async function getBookmarkStatus({ entityId, entityType }: Bookmark) {
  const { data } = await api.get(`${API.TOUR.GET_BOOKMARK_STATUS}/${entityType}/${entityId}`);
  return data;
}

export const useGetBookmarkStatus = ({ entityId, entityType }: Bookmark) => {
  return useQuery({
    queryKey: ['bookmark-status', entityId, entityType],
    queryFn: () =>
      getBookmarkStatus({
        entityId: entityId,
        entityType: entityType,
      }),
  });
};

// Toggle bookmark
async function toggleBookmark({ entityId, entityType }: Bookmark) {
  const { data } = await api.post(`${API.TOUR.TOGGLE_BOOKMARK}/${entityType}/${entityId}`);
  return data;
}

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBookmark,
    onSuccess: (_, tourId) => {
      // Invalidate bookmark status query to refetch
      queryClient.invalidateQueries({
        queryKey: ['bookmark-status', tourId],
      });
    },
  });
};
