import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCarouselComponent } from './upload-carousel.component';

describe('UploadCarouselComponent', () => {
  let component: UploadCarouselComponent;
  let fixture: ComponentFixture<UploadCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
