import { AppointmentInterface } from "../../appointment/interfaces/appointment.interface";
import { SaleInterface } from "./sale.interface";

export interface SaleAppointmentDetailInterface {
  id: number;
  sale_id: number;
  appointment_id: number;
  price: number;
  appointment: AppointmentInterface;
  sale?: SaleInterface;
}

export interface SaleAppointmentDetailPayload extends Omit<SaleAppointmentDetailInterface, 'id'> { }
