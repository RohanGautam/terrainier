import { TestBed } from '@angular/core/testing';

import { GoogleMapInitializeService } from './google-map-initialize.service';

describe('GoogleMapInitializeService', () => {
  let service: GoogleMapInitializeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapInitializeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
