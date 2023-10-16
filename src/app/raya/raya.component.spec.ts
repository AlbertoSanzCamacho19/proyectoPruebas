import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RayaComponent } from './raya.component';

describe('RayaComponent', () => {
  let component: RayaComponent;
  let fixture: ComponentFixture<RayaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RayaComponent]
    });
    fixture = TestBed.createComponent(RayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
