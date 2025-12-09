import { TourServiceInfoType } from '@/core/enum/tour-service-info.enum';

export interface Service {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface TourServiceInfo {
  id: string;
  name: string;
  description: string;
  included?: boolean;
  type?: TourServiceInfoType;
}

export interface ServiceInfoBasic {
  id: string;
  name: string;
  description?: string;
}
