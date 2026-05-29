export interface ProfileInterface {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: Date;
  address?: string;
  created_at: Date;
  updated_at: Date;
}
