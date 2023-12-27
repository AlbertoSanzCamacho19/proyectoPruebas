import { TestBed } from '@angular/core/testing';

import { CuatroRService } from './cuatro-r.service';

describe('CuatroRService', () => {
  let service: CuatroRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuatroRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
