import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableResolver } from './resolver/data-table.resolver';
import { DataTableComponent } from './data-table/data-table.component';

const routes: Routes = [
  {
    path: '',
    component: DataTableComponent,
    resolve: {
      dataApiResponse: DataTableResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataTableRoutingModule {}
