import { ProfileInterface } from './profile,interface';

export interface UserInterface {
  id: number;
  username: string;
  email: string;
  email_verified_at?: Date;
  phone_number?: string;
  role: string;
  permissions: string;
  profile_id: number;
  disabled_at?: null;
  created_at?: Date;
  updated_at?: Date;
  profile: ProfileInterface;
}
