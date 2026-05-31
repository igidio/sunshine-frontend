export interface TreatmentInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at: Date;
  updated_at: Date;
  disabled_at?: Date;
  deleted_at?: Date;
}
