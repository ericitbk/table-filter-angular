import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SetDataToTypeMapping } from '../../core/states';
import { Operators } from '../../shared/enums/operators';
import { DataApiResponse, TableDataModel, TableFilter } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})

export class DataTableService {
  tableData: TableDataModel[];

  constructor(private readonly http: HttpClient, private readonly store: Store) {}

  loadTableData(page = 0, limit = 20): Observable<DataApiResponse> {
    const url = `/assets/data/table_data.json`;
    if (!this.tableData) {
      return this.http.get<DataApiResponse>(url).pipe(
        map((response: TableDataModel) => {
          let dataToTypeMapping: Record<string, string>[] = [];
          const indexKeys = Object.keys(response);
          const objectKeys = Object.keys(response[indexKeys[0]]);
          objectKeys.forEach((key: string, index: number) => {
            dataToTypeMapping.push({ field: key, type: typeof response[indexKeys[0]][key] });
            if (index === objectKeys.length - 1) {
              this.store.dispatch(new SetDataToTypeMapping(dataToTypeMapping));
            }
          });
          this.tableData = indexKeys.map((key: string) => response[key]);
          return {
            currentPage: page,
            totalPages: this.tableData.length,
            data: this.getPagedData(page, limit),
          };
        })
      );
    } else {
      return of({
        currentPage: page,
        totalPages: Object.keys(this.tableData).length,
        data: this.getPagedData(page, limit),
      });
    }
  }
  getPagedData(page: number, limit: number, tableData: TableDataModel[] = this.tableData): TableDataModel[] {
    return tableData.slice(page * 20, limit + page * 20);
  }
  getFilteredResponse(tableFilters: TableFilter[]): Observable<DataApiResponse> {
    const filteredData = this.filterData(tableFilters);
    return of({ currentPage: 0, totalPages: filteredData.length, data: filteredData });
  }
  filterData(
    filters: TableFilter[],
    page: number = 0,
    limit: number = 20,
    tableDataSet: TableDataModel[] = this.tableData
  ): TableDataModel[] {
    const tableFilters = [...filters];
    const filter = tableFilters.pop();
    const filteredDataSet = tableDataSet.filter((tableData: TableDataModel) => {

      switch (filter?.operator) {
        case Operators.GREATER_THAN_OR_EQUAL_TO: {
          return tableData[filter?.field] >= filter.value;
        }
        case Operators.LESS_THAN_OR_EQUAL_TO: {
          return tableData[filter?.field] <= filter.value;
        }
        case Operators.EQUALS: {
          return tableData[filter?.field] === filter.value;
        }
        case Operators.DOES_NOT_EQUAL: {
          return tableData[filter?.field] !== filter.value;
        }
        case Operators.CONTAINS: {
          return tableData[filter?.field].includes(filter.value);
        }
        case Operators.DOES_NOT_CONTAIN: {
          return !tableData[filter?.field].includes(filter.value);
        }
        default: {
          return tableData;
        }
      }
    });
    if (tableFilters.length) {
      this.filterData(tableFilters, page, limit, filteredDataSet);
    }
    return this.getPagedData(page, limit, filteredDataSet);
  }
}
