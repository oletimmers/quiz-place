import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEnvComponent } from './user-env.component';

describe('UserEnvComponent', () => {
  let component: UserEnvComponent;
  let fixture: ComponentFixture<UserEnvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserEnvComponent]
    });
    fixture = TestBed.createComponent(UserEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
