import { TestBed } from '@angular/core/testing';

import { HotelContractService } from './hotel-contract.service';

describe('HotelContractService', () => {
  let service: HotelContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
