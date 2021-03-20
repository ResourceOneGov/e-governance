import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElearningDialogComponent } from './elearning-dialog.component';

describe('ElearningDialogComponent', () => {
  let component: ElearningDialogComponent;
  let fixture: ComponentFixture<ElearningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElearningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElearningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
