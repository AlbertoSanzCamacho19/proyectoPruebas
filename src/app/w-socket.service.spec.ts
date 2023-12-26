import { TestBed } from '@angular/core/testing';

import { WSocketService } from './w-socket.service';

describe('WSocketService', () => {
  let service: WSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
