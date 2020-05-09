import { TestBed } from '@angular/core/testing';

import { InterComponentCommunicationService } from './inter-component-communication.service';

describe('InterComponentCommunicationService', () => {
  let service: InterComponentCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterComponentCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
