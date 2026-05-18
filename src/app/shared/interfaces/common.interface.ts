export interface PaginationResponseInterface<Data> {
  count: number;
  data: Data[];
  limit: number;
  offset: number;
  is_last_page: boolean;
}
