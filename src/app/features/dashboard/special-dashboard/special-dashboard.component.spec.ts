import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialDashboardComponent } from './special-dashboard.component';

describe('SpecialDashboardComponent', () => {
  let component: SpecialDashboardComponent;
  let fixture: ComponentFixture<SpecialDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
