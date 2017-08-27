import { TestBed, inject } from '@angular/core/testing';

import { GeneralEventService } from './general-event.service';

describe('GeneralEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralEventService]
    });
  });

  it('should ...', inject([GeneralEventService], (service: GeneralEventService) => {
    expect(service).toBeTruthy();
  }));
});
