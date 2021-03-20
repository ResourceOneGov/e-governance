import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerFilterDialogComponent } from './volunteer-filter-dialog.component';

describe('VolunteerFilterDialogComponent', () => {
  let component: VolunteerFilterDialogComponent;
  let fixture: ComponentFixture<VolunteerFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolunteerFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
