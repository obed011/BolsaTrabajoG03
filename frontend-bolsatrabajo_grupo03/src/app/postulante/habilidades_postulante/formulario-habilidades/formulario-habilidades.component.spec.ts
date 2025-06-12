import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioHabilidadesComponent } from './formulario-habilidades.component';

describe('FormularioHabilidadesComponent', () => {
  let component: FormularioHabilidadesComponent;
  let fixture: ComponentFixture<FormularioHabilidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioHabilidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioHabilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
