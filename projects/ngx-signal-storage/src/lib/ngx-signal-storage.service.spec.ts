import { TestBed } from '@angular/core/testing';

import { NgxSignalStorageService } from './ngx-signal-storage.service';

describe('NgxSignalStorageService', () => {
  let service: NgxSignalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSignalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
