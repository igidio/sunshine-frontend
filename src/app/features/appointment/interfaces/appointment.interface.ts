import { CustomerInterface } from '@/app/features/customer/interfaces/customer.interface';
import { TreatmentInterface } from '@/app/features/treatments/interfaces/treatment.interface';

export interface AppointmentInterface {
  id: number;
  customer_id: number;
  treatment_id: number;
  date: Date;
  time_start: string;
  time_end: string;
  notes: string | null;
  disabled_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  customer?: CustomerInterface | null;
  treatment?: TreatmentInterface | null;
}
