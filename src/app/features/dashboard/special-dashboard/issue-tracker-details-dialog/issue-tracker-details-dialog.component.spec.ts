import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTrackerDetailsDialogComponent } from './issue-tracker-details-dialog.component';

describe('IssueTrackerDetailsDialogComponent', () => {
  let component: IssueTrackerDetailsDialogComponent;
  let fixture: ComponentFixture<IssueTrackerDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueTrackerDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueTrackerDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
