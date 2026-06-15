export interface ProfileInterface {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: Date | string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export type ProfileCreateInterface = Omit<ProfileInterface, 'id' | 'created_at' | 'updated_at'>;
