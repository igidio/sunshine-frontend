import { CustomerInterface } from "../../customer/interfaces/customer.interface";
import { SaleAppointmentDetailInterface } from "./sale_appointment_detail.interface";
import { SaleProductDetailInterface } from "./sale_product_detail.interface";

type PaymentMethod = "cash" | "card" | "transfer";

export interface SaleInterface {
  id: number;
  customer_id: number;
  total: number;
  payment_method: PaymentMethod;
  created_at?: Date;
  customer: CustomerInterface;
  product_details: SaleProductDetailInterface[];
  appointment_details: SaleAppointmentDetailInterface[];
}

export interface SalePayload extends Omit<SaleInterface, 'id' | 'created_at'> { }
