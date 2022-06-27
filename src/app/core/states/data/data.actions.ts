export class SetDataToTypeMapping {
  static readonly type = '[DATA] Set Data To Type Mapping';
  constructor(public payload: Record<string, string>[]) {}
}
