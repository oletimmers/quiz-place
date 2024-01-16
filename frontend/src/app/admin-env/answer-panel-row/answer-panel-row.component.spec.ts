import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerPanelRowComponent } from './answer-panel-row.component';

describe('AnswerPanelRowComponent', () => {
  let component: AnswerPanelRowComponent;
  let fixture: ComponentFixture<AnswerPanelRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnswerPanelRowComponent]
    });
    fixture = TestBed.createComponent(AnswerPanelRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
