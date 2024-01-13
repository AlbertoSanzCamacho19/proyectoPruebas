import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrarUsuarioComponent } from './borrar-usuario.component';

describe('BorrarUsuarioComponent', () => {
  let component: BorrarUsuarioComponent;
  let fixture: ComponentFixture<BorrarUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrarUsuarioComponent]
    });
    fixture = TestBed.createComponent(BorrarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
