import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadUsersByLocationComponent } from './upload-users-by-location.component';

describe('UploadUsersByLocationComponent', () => {
  let component: UploadUsersByLocationComponent;
  let fixture: ComponentFixture<UploadUsersByLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadUsersByLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadUsersByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
