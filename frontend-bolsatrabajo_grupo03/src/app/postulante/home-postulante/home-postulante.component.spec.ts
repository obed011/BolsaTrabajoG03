import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePostulanteComponent } from './home-postulante.component';

describe('HomePostulanteComponent', () => {
  let component: HomePostulanteComponent;
  let fixture: ComponentFixture<HomePostulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePostulanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePostulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
