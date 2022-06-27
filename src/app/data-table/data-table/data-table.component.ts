import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { skip, switchMap, takeUntil } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { DataTableService } from '../service/data-table.service';
import { MIN_STRING_LENGTH_FOR_TOOLTIP } from '../../shared/constants';
import { DataApiResponse, TableDataModel, TableFilter } from '../../shared/models';
import { CloseMenu, OpenMenu, SidebarState, TableFiltersState } from '../../core/states';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements AfterViewInit, OnDestroy, OnInit {
  totalPages: number;
  currentPage: number;
  destroyed$: Subject<boolean>;
  displayedColumns: string[] = [];
  dataSource: TableDataModel[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<TableDataModel>;

  @Select(SidebarState.isSidebarOpen) isSidebarOpen$: Observable<boolean>;
  @Select(TableFiltersState.filters) filters$: Observable<TableFilter[]>;

  constructor(
    private readonly store: Store,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dataTableService: DataTableService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const { totalPages, data } = this.activatedRoute.snapshot.data.dataApiResponse;
    this.dataSource = data;
    this.totalPages = totalPages;
    this.displayedColumns = Object.keys(this.dataSource[0]);
    this.filters$
      .pipe(
        skip(1),
        switchMap((tableFilters: TableFilter[]) => {
          return this.dataTableService.getFilteredResponse(tableFilters);
        })
      )
      .subscribe((response: DataApiResponse) => {
        this.currentPage = 0;
        this.dataSource = response.data;
        this.totalPages = response.totalPages;
        this.table.renderRows();
      });
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        takeUntil(this.destroyed$),
        switchMap((pageEvent: PageEvent) => this.dataTableService.loadTableData(pageEvent?.pageIndex))
      )
      .subscribe((response: DataApiResponse) => {
        this.dataSource = response.data;
        this.currentPage = response.currentPage;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  showCellTooltip(element: string): string {
    return element.length > MIN_STRING_LENGTH_FOR_TOOLTIP ? element : '';
  }

  toggleMenu(): void {
    this.store.dispatch(new OpenMenu());
  }

  closeSidebar(): void {
    this.store.dispatch(new CloseMenu());
  }
}
