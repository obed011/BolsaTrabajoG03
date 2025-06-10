import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPostulanteComponent } from './dashboard-postulante.component';

describe('DashboardPostulanteComponent', () => {
  let component: DashboardPostulanteComponent;
  let fixture: ComponentFixture<DashboardPostulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPostulanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPostulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
