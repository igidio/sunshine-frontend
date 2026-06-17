export interface ConfirmationInterface {
  id: number;
  token: string;
  type: string;
  created_at: Date;
  updated_at: Date;
  has_used: boolean;
  is_valid: boolean;
  invalidated_by?: number;
  expiration_days: number;
  description: string;
}
