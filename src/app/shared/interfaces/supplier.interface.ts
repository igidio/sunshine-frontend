export interface SupplierInterface {
  id: number;
  name: string;
  description: string;
  phone_number: string;
  image_url: string | null;
  email: string;
  address: string;
  created_at: Date;
  updated_at: Date;
  disabled_at: Date | null;
  deleted_at: Date | null;
}
