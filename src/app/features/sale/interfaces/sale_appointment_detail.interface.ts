export interface SaleAppointmentDetailInterface {
  id: number;
  sale_id: number;
  treatment_id: number;
  staff_id: number;
  price: number;
}

export interface SaleAppointmentDetailPayload extends Omit<SaleAppointmentDetailInterface, 'id'> { }
