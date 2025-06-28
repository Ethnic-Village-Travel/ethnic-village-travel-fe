import { TourStatusEnum } from '@/constants/enum/tour.enum';
import { MOCK_TOURS } from '@/data/tours';

import { Tour } from '@/types/tour.type';

interface SearchOptions {
  searchTerm?: string;
  status?: string[];
  page?: number;
  pageSize?: number;
}

interface SearchResult {
  data: Tour[];
  pageCount: number;
  statusCounts: Record<string, number>;
}

export function searchTours({ searchTerm = '', status = [], page = 1, pageSize = 10 }: SearchOptions): SearchResult {
  // Filter by search term (case insensitive)
  let filteredTours = MOCK_TOURS.filter(
    tour =>
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.overview?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.ethnics?.some(ethnic => ethnic.name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Filter by status if specified
  if (status.length > 0) {
    filteredTours = filteredTours.filter(tour => {
      if (tour.status) return status.includes(tour.status);
    });
  }

  // Calculate status counts for all tours
  const statusCounts = Object.values(TourStatusEnum).reduce(
    (acc, status) => {
      acc[status.value] = MOCK_TOURS.filter(tour => tour.status === status.value).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredTours.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTours = filteredTours.slice(startIndex, endIndex);

  return {
    data: paginatedTours,
    pageCount: totalPages,
    statusCounts,
  };
}

// Simulate async API call
export async function fetchTours(options: SearchOptions): Promise<SearchResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return searchTours(options);
}
