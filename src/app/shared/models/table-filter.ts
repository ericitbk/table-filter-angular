export interface TableFilter {
  field: string;
  operator: string;
  value: string;
}

export interface TableFilterWithFieldType {
  field: { field: string; type: string };
  operator: string;
  value: string;
}
