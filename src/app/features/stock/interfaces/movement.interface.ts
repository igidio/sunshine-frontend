import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { ProductInterface } from '../../product/interfaces/product.interface';

export const movement_type = [
  'purchase',
  'expired',
  'damaged',
  'lost',
  'adjustment',
  'internal_use',
] as const;
export type MovementType = (typeof movement_type)[number];

export interface MovementInterface {
  id: number;
  supplier_id: number;
  stock_id: number;
  type: MovementType;
  quantity: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  product: ProductInterface;
  supplier: SupplierInterface;
}
