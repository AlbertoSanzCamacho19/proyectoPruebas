import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioPasswordComponent } from './cambioPassword.component';

describe('CambioPasswordComponent', () => {
  let component: CambioPasswordComponent;
  let fixture: ComponentFixture<CambioPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambioPasswordComponent]
    });
    
    fixture = TestBed.createComponent(CambioPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
