import { TestBed } from '@angular/core/testing';

import { ReceipptDataService } from './receippt-data.service';

describe('ReceipptDataService', () => {
  let service: ReceipptDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceipptDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
