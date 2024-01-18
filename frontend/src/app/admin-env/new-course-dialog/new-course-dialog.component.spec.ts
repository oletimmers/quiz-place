import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCourseDialogComponent } from './new-course-dialog.component';

describe('NewCourseDialogComponent', () => {
  let component: NewCourseDialogComponent;
  let fixture: ComponentFixture<NewCourseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCourseDialogComponent]
    });
    fixture = TestBed.createComponent(NewCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
