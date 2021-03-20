import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBulkUsersComponent } from './upload-bulk-users.component';

describe('UploadBulkUsersComponent', () => {
  let component: UploadBulkUsersComponent;
  let fixture: ComponentFixture<UploadBulkUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBulkUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBulkUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
