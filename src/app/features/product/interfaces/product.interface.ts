export interface ProductInterface {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  created_at: Date;
  updated_at: Date;
  disabled_at: Date | null;
  images: any[];
  stock: StockInterface;
}

export interface StockInterface {
  id: number;
  quantity: number;
  created_at: Date;
  deleted_at: Date | null;
  product_id: number;
  updated_at: Date;
}

export interface ProductImageInterface {
  id: number;
  image_url: string;
  created_at: Date;
  deleted_at?: Date;
  product_id: number;
  updated_at?: Date;
}
