import { TableFilter } from '../../../shared/models';

export class AddTableFilter {
  static readonly type = '[DATA] Add Table Filter';
  constructor(public payload: TableFilter) {}
}

export class RemoveTableFilter {
  static readonly type = '[DATA] Remove Table Filter';
  constructor(public payload: TableFilter) {}
}
