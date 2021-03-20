import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadIssueComponent } from './upload-issue.component';

describe('UploadIssueComponent', () => {
  let component: UploadIssueComponent;
  let fixture: ComponentFixture<UploadIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
