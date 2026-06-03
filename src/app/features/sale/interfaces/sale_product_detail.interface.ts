import { ProductInterface } from "../../product/interfaces/product.interface";

export interface SaleProductDetailInterface {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product: ProductInterface;
}

export interface SaleProductDetailPayload extends Omit<SaleProductDetailInterface, 'id'> { }
