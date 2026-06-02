import { CustomerInterface } from '@/app/features/customer/interfaces/customer.interface';
import { TreatmentInterface } from '@/app/features/treatments/interfaces/treatment.interface';

export interface AppointmentInterface {
  id: number;
  customer_id: number;
  treatment_id: number;
  date: string;
  time_start: string;
  time_end: string;
  notes: string | null;
  disabled_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  customer?: CustomerInterface | null;
  treatment?: TreatmentInterface | null;
}

export interface AppointmentPayload extends Omit<AppointmentInterface, 'id' | 'created_at' | 'updated_at' | 'customer' | 'treatment' | 'time_start' | 'time_end'> {
  time: string;
  time_end?: string;
}
