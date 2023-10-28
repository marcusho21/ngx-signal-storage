import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSignalStorageComponent } from './ngx-signal-storage.component';

describe('NgxSignalStorageComponent', () => {
  let component: NgxSignalStorageComponent;
  let fixture: ComponentFixture<NgxSignalStorageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxSignalStorageComponent]
    });
    fixture = TestBed.createComponent(NgxSignalStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
