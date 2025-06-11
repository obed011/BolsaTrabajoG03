import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioExperienciaComponent } from './formulario-experiencia.component';

describe('FormularioExperienciaComponent', () => {
  let component: FormularioExperienciaComponent;
  let fixture: ComponentFixture<FormularioExperienciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioExperienciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioExperienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
