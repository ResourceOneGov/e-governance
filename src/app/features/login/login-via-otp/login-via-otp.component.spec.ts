import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginViaOtpComponent } from './login-via-otp.component';

describe('LoginViaOtpComponent', () => {
  let component: LoginViaOtpComponent;
  let fixture: ComponentFixture<LoginViaOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginViaOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginViaOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
