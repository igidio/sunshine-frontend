import { ProfileInterface } from '../../user/interfaces/profile.interface';

export interface CustomerInterface {
  id: number;
  profile_id: number;
  disabled_at?: Date;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
  profile: ProfileInterface;
}
