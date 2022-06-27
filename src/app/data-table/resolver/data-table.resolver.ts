import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { DataApiResponse } from '../../shared/models';
import { DataTableService } from '../service/data-table.service';

@Injectable({
  providedIn: 'root',
})

export class DataTableResolver implements Resolve<DataApiResponse> {
  constructor(private readonly dataTableService: DataTableService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DataApiResponse> {
    return this.dataTableService.loadTableData();
  }
}
