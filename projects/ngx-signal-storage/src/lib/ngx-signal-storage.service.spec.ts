import { TestBed } from '@angular/core/testing';

import {
  NgxSignalStorageService,
  provideNgxSignalStorage,
} from './ngx-signal-storage.service';

describe('NgxSignalStorageService', () => {
  let service: NgxSignalStorageService<{}>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNgxSignalStorage()],
    });
    service = TestBed.inject(NgxSignalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
