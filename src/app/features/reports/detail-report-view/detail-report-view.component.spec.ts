import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReportViewComponent } from './detail-report-view.component';

describe('DetailReportViewComponent', () => {
  let component: DetailReportViewComponent;
  let fixture: ComponentFixture<DetailReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailReportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
