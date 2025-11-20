import api from '@/data/apis/axios';
import { API } from '@/data/apis/define';
import { encodeQueryData } from '@/data/apis/helper';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

// Get normal query
async function getListCategories(filters: any) {
  filters = encodeQueryData(filters);
  const { data } = await api.get(`${API.BLOG.GET}?${filters}`);
  return data;
}

export const useGetListCategories = (filters = {}) => {
  return useQuery({
    queryKey: ['get-list-categories', filters],
    queryFn: () => getListCategories(filters),
    staleTime: 0,
  });
};

// Infinite query
async function getPostFilter({ pageParam = 1 }, filters: any) {
  filters.page = pageParam;
  filters = encodeQueryData(filters);
  const { data } = await api.get(`${API.BLOG.GET}?${filters}`);
  return data;
}

export const useGetPostFilterInfinity = (filters: any = {}) => {
  filters.limit = 6;
  return useInfiniteQuery({
    queryKey: ['get-post-filter-infinity', filters],
    queryFn: x => {
      const pageParam = x?.pageParam ?? 1;
      return getPostFilter({ pageParam }, filters);
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, pages) => {
      const { data } = _lastPage;
      if (data?.next_page === true) return pages.length + 1;
      return undefined;
    },
    staleTime: 0,
  });
};

// Post form
async function postContact(body: any) {
  const formData = new FormData();

  for (const key in body) {
    formData.append(key, body[key]);
  }

  const { data } = await api.post(API.CONTACT.SEND, formData);
  return data;
}

export const usePostContact = () => {
  return useMutation({
    mutationFn: postContact,
  });
};

// Get with useMutation
async function getSignatureDeposit(filters: any, userToken: string) {
  try {
    filters = encodeQueryData(filters);
    if (userToken) {
      const { data } = await api.get(`${API.AUTH.SIGNIN}?${filters}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      return data;
    }
    return {};
  } catch {
    throw new Error('Something went wrong with our system. Please try again!');
  }
}

export const useGetSignatureDeposit = () => {
  const userToken = 'abc';
  return useMutation({ mutationFn: filters => getSignatureDeposit(filters, userToken) });
};

// post normal
async function postLogin(wallet: any) {
  try {
    const { data } = await api.post(`${API.AUTH.SIGNIN}?${encodeQueryData(wallet)}`);
    return data;
  } catch {
    throw new Error('Something went wrong with our system. Please try again!');
  }
}

export const usePostLogin = () => {
  return useMutation({
    mutationFn: postLogin,
  });
};
