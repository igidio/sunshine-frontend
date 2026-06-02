type PaymentMethod = "cash" | "card" | "transfer";

export interface SaleInterface {
  id: number;
  customer_id: number;
  total: number;
  payment_method: PaymentMethod;
  created_at?: Date;
}

export interface SalePayload extends Omit<SaleInterface, 'id' | 'created_at'> { }
