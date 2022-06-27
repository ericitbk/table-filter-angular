import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import {CloseMenu, DataState, AddTableFilter, RemoveTableFilter} from '../../core/states';
import { dataTypeToOperatorMapping } from '../../shared/constants/data-type-to-operator-mapping';
import { TableFilterWithFieldType } from '../../shared/models';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFilterComponent implements OnInit {
  @Input() columns: string[];
  tableFilterForm: FormGroup;
  dataFields: Record<string, string>[] = [];
  appliedFilters: TableFilterWithFieldType[] = [];

  @ViewChild('formDirective') formDirective: FormGroupDirective;

  @Select(DataState.dataToTypeMapping) dataToTypeMapping$: Observable<Record<string, string>[]>;

  get field(): AbstractControl {
    return this.tableFilterForm.get('field') as AbstractControl;
  }

  get operator(): AbstractControl {
    return this.tableFilterForm.get('operator') as AbstractControl;
  }

  get value(): AbstractControl {
    return this.tableFilterForm.get('value') as AbstractControl;
  }

  constructor(
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tableFilterForm = this.formBuilder.group({
      field: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.dataToTypeMapping$.subscribe(value => {
      this.dataFields = value;
    })
  }

  onApplyFilterClick(): void {
    this.dataFields = this.dataFields.filter(dataField => dataField.field !== this.field.value.field);
    this.appliedFilters.push(this.tableFilterForm.value);
    this.store.dispatch(new AddTableFilter({ ...this.tableFilterForm.value, field: this.field.value.field }));
    this.formDirective.resetForm();
    this.changeDetectorRef.markForCheck();
  }

  closeSidebar(): void {
    this.store.dispatch(new CloseMenu());
  }

  getOperatorsBasedOnFieldType(field: Record<string, string>): string[] {
    return dataTypeToOperatorMapping[field?.type];
  }

  onFilterRemoveClick(filterToRemove: TableFilterWithFieldType): void {
    this.dataFields.push(filterToRemove.field);
    this.appliedFilters = this.appliedFilters.filter(filter => filter.field.field !== filterToRemove.field.field);
    this.store.dispatch(new RemoveTableFilter({ ...filterToRemove, field: filterToRemove.field.field }));
    this.onApplyFilterClick();
  }
}
