import { useEffect } from 'react';
import { ethnicApi } from '@/apis/ethnic.api';
import { locationApi } from '@/apis/location.api';
import { useMetaStore } from '@/store/useMetaStore';

export const fetchEthnics = async () => {
  const res = await ethnicApi.getEthnicAll();
  useMetaStore.getState().setEthnics(res.data || []);
  return res.data || [];
};

export const fetchLocations = async () => {
  const res = await locationApi.getLocationAll();
  useMetaStore.getState().setLocations(res.data || []);
  return res.data || [];
};
