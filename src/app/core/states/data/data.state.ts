import { Injectable } from '@angular/core';

import produce from 'immer';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SetDataToTypeMapping } from './data.actions';
import { DataStateModel, TableFilterStateModel } from '../../../shared/models';

@State<DataStateModel>({
  name: 'data',
  defaults: {
    dataToTypeMapping: [],
  },
})
@Injectable()
export class DataState {
  @Selector()
  static dataToTypeMapping(state: DataStateModel): Record<string, string>[] {
    return state.dataToTypeMapping;
  }

  @Action(SetDataToTypeMapping)
  setDataToTypeMapping({ setState, getState }: StateContext<DataStateModel>, action: SetDataToTypeMapping) {
    setState(
      produce(getState(), (draft: TableFilterStateModel) => ({
        ...draft,
        dataToTypeMapping: action.payload,
      }))
    );
  }
}
