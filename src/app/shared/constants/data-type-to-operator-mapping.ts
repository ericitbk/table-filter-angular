import { Operators } from '../enums/operators';

export const dataTypeToOperatorMapping: Record<string, string[]> = {
  string: [Operators.CONTAINS, Operators.DOES_NOT_CONTAIN, Operators.EQUALS],
  number: [Operators.GREATER_THAN_OR_EQUAL_TO, Operators.LESS_THAN_OR_EQUAL_TO, Operators.EQUALS],
};
