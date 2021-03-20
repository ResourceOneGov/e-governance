import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerTrainingComponent } from './volunteer-training.component';

describe('VolunteerTrainingComponent', () => {
  let component: VolunteerTrainingComponent;
  let fixture: ComponentFixture<VolunteerTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolunteerTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
