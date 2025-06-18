export interface Service {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface TourService {
  id: number;
  name: string;
  description: string;
  type: ServiceEnum;
}

export enum ServiceEnum {
  INCLUDED = 'INCLUDED',
  EXCLUDED = 'EXCLUDED',
  OPTIONAL = 'OPTIONAL',
}
