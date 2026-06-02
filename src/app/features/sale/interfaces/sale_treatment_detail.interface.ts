export interface SaleTreatmentDetailInterface {
  id: number;
  sale_id: number;
  treatment_id: number;
  staff_id: number;
  price: number;
}

export interface SaleTreatmentDetailPayload extends Omit<SaleTreatmentDetailInterface, 'id'> { }
