import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDistrictInfoComponent } from './issue-district-info.component';

describe('IssueDistrictInfoComponent', () => {
  let component: IssueDistrictInfoComponent;
  let fixture: ComponentFixture<IssueDistrictInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueDistrictInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDistrictInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
