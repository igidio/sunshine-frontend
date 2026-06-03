import { AppointmentInterface } from "../../appointment/interfaces/appointment.interface";

export interface SaleAppointmentDetailInterface {
  id: number;
  sale_id: number;
  appointment_id: number;
  staff_id: number;
  price: number;
  appointment: AppointmentInterface;
}

export interface SaleAppointmentDetailPayload extends Omit<SaleAppointmentDetailInterface, 'id'> { }
