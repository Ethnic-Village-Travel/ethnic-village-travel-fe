import { TourServiceInfoType } from "@/constants/enum/tour-service-info.enum";

export interface Service {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface TourServiceInfo {
  id: number;
  name: string;
  description: string;
  type: TourServiceInfoType;
}

export interface ServiceInfoBasic {
  id: string;
  name: string;
  description?: string;
}
