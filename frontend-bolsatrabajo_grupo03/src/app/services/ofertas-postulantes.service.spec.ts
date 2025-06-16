import { TestBed } from '@angular/core/testing';

import { OfertasPostulantesService } from './ofertas-postulantes.service';

describe('OfertasPostulantesService', () => {
  let service: OfertasPostulantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfertasPostulantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
