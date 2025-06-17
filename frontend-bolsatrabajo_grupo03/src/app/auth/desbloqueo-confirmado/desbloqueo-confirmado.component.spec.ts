import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesbloqueoConfirmadoComponent } from './desbloqueo-confirmado.component';

describe('DesbloqueoConfirmadoComponent', () => {
  let component: DesbloqueoConfirmadoComponent;
  let fixture: ComponentFixture<DesbloqueoConfirmadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesbloqueoConfirmadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesbloqueoConfirmadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
