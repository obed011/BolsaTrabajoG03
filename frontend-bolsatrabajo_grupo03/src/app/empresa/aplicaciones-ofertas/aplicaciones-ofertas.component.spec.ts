import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicacionesOfertasComponent } from './aplicaciones-ofertas.component';

describe('AplicacionesOfertasComponent', () => {
  let component: AplicacionesOfertasComponent;
  let fixture: ComponentFixture<AplicacionesOfertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicacionesOfertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicacionesOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
