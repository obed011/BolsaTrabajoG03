import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesbloquearUsuarioComponent } from './desbloquear-usuario.component';

describe('DesbloquearUsuarioComponent', () => {
  let component: DesbloquearUsuarioComponent;
  let fixture: ComponentFixture<DesbloquearUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesbloquearUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesbloquearUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
