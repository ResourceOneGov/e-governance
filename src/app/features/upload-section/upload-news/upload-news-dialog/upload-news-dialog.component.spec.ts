import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNewsDialogComponent } from './upload-news-dialog.component';

describe('UploadNewsDialogComponent', () => {
  let component: UploadNewsDialogComponent;
  let fixture: ComponentFixture<UploadNewsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadNewsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNewsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
