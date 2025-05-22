export interface Rating {
  id: number;
  entity_id: number;
  entity_type: string;
  user_id: number;
  rating: number;
  content?: string;
  created_at: string;
  updated_at: string;
}
