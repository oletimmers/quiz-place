import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnvComponent } from './admin-env.component';

describe('AdminEnvComponent', () => {
  let component: AdminEnvComponent;
  let fixture: ComponentFixture<AdminEnvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminEnvComponent]
    });
    fixture = TestBed.createComponent(AdminEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
