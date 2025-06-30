import instance from '@/core/api/api';
import { API } from '@/core/api/config';

import { ApiResponse } from '@/types/api.type';
import { UserDetailsResponse } from '@/types/user.type';

export const getUserDetails = async (): Promise<ApiResponse<UserDetailsResponse>> => {
  try {
    const response = await instance.get<ApiResponse<UserDetailsResponse>>(API.USER.DETAILS);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user details');
  }
};
