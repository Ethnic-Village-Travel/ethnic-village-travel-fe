import instance from '@/data/apis/axios';
import { API } from '@/data/apis/define';

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
