import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { ProductInterface } from '../../product/interfaces/product.interface';

export interface MovementInterface {
  id: number;
  supplier_id: number;
  stock_id: number;
  type: string;
  quantity: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  product: ProductInterface;
  supplier: SupplierInterface;
}
