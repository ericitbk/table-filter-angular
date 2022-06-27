import { TestBed } from '@angular/core/testing';

import { DataTableResolver } from './data-table.resolver';

describe('DataTableResolver', () => {
  let resolver: DataTableResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DataTableResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
