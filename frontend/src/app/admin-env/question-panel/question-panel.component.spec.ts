import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPanelComponent } from './question-panel.component';

describe('QuestionPanelComponent', () => {
  let component: QuestionPanelComponent;
  let fixture: ComponentFixture<QuestionPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionPanelComponent]
    });
    fixture = TestBed.createComponent(QuestionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
