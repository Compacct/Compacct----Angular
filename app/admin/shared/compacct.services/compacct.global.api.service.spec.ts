import { TestBed } from '@angular/core/testing';

import { CompacctGlobalApiService } from './compacct.global.api.service';

describe('CompacctGlobalApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompacctGlobalApiService = TestBed.get(CompacctGlobalApiService);
    expect(service).toBeTruthy();
  });
});
