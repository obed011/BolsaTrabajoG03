import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormacionAcademicaComponent } from './formacion-academica.component';

describe('FormacionAcademicaComponent', () => {
  let component: FormacionAcademicaComponent;
  let fixture: ComponentFixture<FormacionAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormacionAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormacionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
