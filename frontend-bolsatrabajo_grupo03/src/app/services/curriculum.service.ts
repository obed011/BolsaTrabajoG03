import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
  private API = environment.apiUrl + '/postulantes/curriculum';

  constructor(private http: HttpClient) { }
  getCurriculumByPostulanteId(postulanteId: number) {
    return this.http.get(`${this.API}/${postulanteId}`);
  }
}
