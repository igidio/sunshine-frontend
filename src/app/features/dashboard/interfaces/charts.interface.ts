export interface ChartsInterface {
  sales: SalesChartsInterface;
  appointments: AppointmentsChartsInterface;
  inventory: InventoryChartsInterface;
  customers: CustomersChartsInterface;
  catalog: CatalogChartsInterface;
}

export interface AppointmentsChartsInterface {
  this_week: any[];
}

export interface CatalogChartsInterface {
  total_active_products: number;
  products_by_category: ProductsByCategoryChartsInterface[];
  average_price_by_category: AveragePriceByCategoryChartsInterface[];
  most_popular_categories: MostPopularCategoryChartsInterface[];
}

export interface AveragePriceByCategoryChartsInterface {
  category_id: number;
  category_name: string;
  average_price: number;
}

export interface MostPopularCategoryChartsInterface {
  category_id: number;
  category_name: string;
  product_count: number;
}

export interface ProductsByCategoryChartsInterface {
  category_id: number;
  category_name: string;
  total: number;
}

export interface CustomersChartsInterface {
  total: number;
  new_this_month: number;
}

export interface InventoryChartsInterface {
  low_stock: LowStockChartsInterface[];
  total_value: number;
  total_products: number;
}

export interface LowStockChartsInterface {
  stock_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export interface SalesChartsInterface {
  total_today: number;
  total_week: number;
  total_month: number;
  trend: TrendChartsInterface[];
  by_payment_method: ByPaymentMethodChartsInterface[];
  top_products: TopProductChartsInterface[];
  top_treatments: TopTreatmentChartsInterface[];
  latest: LatestChartsInterface[];
  bills: BillsChartsInterface;
}

export interface BillsChartsInterface {
  today: number;
  week: number;
  month: number;
}

export interface ByPaymentMethodChartsInterface {
  payment_method: string;
  total: string;
  count: number;
}

export interface LatestChartsInterface {
  id: number;
  total: number;
  payment_method: PaymentMethod;
  created_at: Date;
  bill: string;
  customer_id: number;
  first_name: string;
  last_name: string;
}

export enum PaymentMethod {
  Cash = "cash",
  Card = "card",
  Transfer = "transfer",
}

export interface TopProductChartsInterface {
  product_id: number;
  product_name: string;
  total_quantity: string;
  total_revenue: number;
}

export interface TopTreatmentChartsInterface {
  treatment_id: number;
  treatment_name: string;
  count: number;
  total_revenue: number;
}

export interface TrendChartsInterface {
  date: Date;
  total: string;
  count: number;
}
