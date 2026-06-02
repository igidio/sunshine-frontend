export interface SaleProductDetailInterface {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface SaleProductDetailPayload extends Omit<SaleProductDetailInterface, 'id'> { }
