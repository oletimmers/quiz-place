import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCarouselComponent } from './question-carousel.component';

describe('QuestionCarouselComponent', () => {
  let component: QuestionCarouselComponent;
  let fixture: ComponentFixture<QuestionCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionCarouselComponent]
    });
    fixture = TestBed.createComponent(QuestionCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
