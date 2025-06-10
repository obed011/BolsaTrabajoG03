import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPostulanteComponent } from './registro-postulante.component';

describe('RegistroPostulanteComponent', () => {
  let component: RegistroPostulanteComponent;
  let fixture: ComponentFixture<RegistroPostulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPostulanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPostulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
