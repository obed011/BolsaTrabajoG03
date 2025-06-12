import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioFormacionComponent } from './formulario-formacion.component';

describe('FormularioFormacionComponent', () => {
  let component: FormularioFormacionComponent;
  let fixture: ComponentFixture<FormularioFormacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioFormacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioFormacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
