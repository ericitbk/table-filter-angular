import { TableDataModel } from './table-data.model';

export interface DataApiResponse {
  currentPage: number;
  totalPages: number;
  data: TableDataModel[];
}
