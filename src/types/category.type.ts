export enum CategoryStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  status: CategoryStatus;
  displayOrder: number;
  tourCount?: number;
}

export interface CategoryTourBasic {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  duration: number;
  adultPrice: number;
  discountPercent?: number;
}

export interface CategoryWithTours extends Omit<Category, 'tourCount'> {
  tours: CategoryTourBasic[];
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  status?: CategoryStatus;
  displayOrder?: number;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  status?: CategoryStatus;
  displayOrder?: number;
}

export interface CategoryTourRequest {
  tourIds: string[];
}
