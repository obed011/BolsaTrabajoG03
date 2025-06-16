import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleosComponent } from './empleos.component';

describe('EmpleosComponent', () => {
  let component: EmpleosComponent;
  let fixture: ComponentFixture<EmpleosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
