import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObserverCarouselComponent } from './observer-carousel.component';

describe('ObserverCarouselComponent', () => {
  let component: ObserverCarouselComponent;
  let fixture: ComponentFixture<ObserverCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObserverCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObserverCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
