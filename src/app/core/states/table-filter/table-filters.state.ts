import { Injectable } from '@angular/core';

import produce from 'immer';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { AddTableFilter, RemoveTableFilter } from './table-filters.actions';
import { TableFilter, TableFilterStateModel } from '../../../shared/models';

@State<TableFilterStateModel>({
  name: 'tableFilter',
  defaults: {
    filters: [],
  },
})
@Injectable()
export class TableFiltersState {
  @Selector()
  static filters(state: TableFilterStateModel): TableFilter[] {
    return state.filters;
  }

  @Action(AddTableFilter)
  addTableFilter({ setState, getState }: StateContext<TableFilterStateModel>, action: AddTableFilter) {
    const newFilters = [...getState().filters, action.payload];
    setState(
      produce(getState(), (draft: TableFilterStateModel) => ({
        ...draft,
        filters: newFilters,
      }))
    );
  }

  @Action(RemoveTableFilter)
  removeTableFilter({ setState, getState }: StateContext<TableFilterStateModel>, action: RemoveTableFilter) {
    const newFilters = getState().filters.filter(filter => filter.field !== action.payload.field);
    setState(
      produce(getState(), (draft: TableFilterStateModel) => ({
        ...draft,
        filters: newFilters,
      }))
    );
  }
}
