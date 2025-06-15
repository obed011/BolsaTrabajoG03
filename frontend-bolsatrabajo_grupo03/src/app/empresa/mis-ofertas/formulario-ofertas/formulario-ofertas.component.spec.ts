import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioOfertasComponent } from './formulario-ofertas.component';

describe('FormularioOfertasComponent', () => {
  let component: FormularioOfertasComponent;
  let fixture: ComponentFixture<FormularioOfertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioOfertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
