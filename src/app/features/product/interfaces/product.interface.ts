export interface ProductModule {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  created_at: Date;
  updated_at: Date;
  disabled_at: Date | null;
  images: any[];
  stock: Stock;
}

export interface Stock {
  id: number;
  quantity: number;
  created_at: Date;
  deleted_at: Date | null;
  product_id: number;
  updated_at: Date;
}
