import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleBroadcastDialogComponent } from './schedule-broadcast-dialog.component';

describe('ScheduleBroadcastDialogComponent', () => {
  let component: ScheduleBroadcastDialogComponent;
  let fixture: ComponentFixture<ScheduleBroadcastDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleBroadcastDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleBroadcastDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
