import { TestBed } from '@angular/core/testing';

import { CommonUserActivityService } from './common-user-activity.service';

describe('CommonUserActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonUserActivityService = TestBed.get(CommonUserActivityService);
    expect(service).toBeTruthy();
  });
});
