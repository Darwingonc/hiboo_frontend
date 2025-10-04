import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DedicationService {

  private url = environment.urlApi;

  constructor(private http: HttpClient) {}

  // Obtener dedicatoria por UUID
  getDedicationByUuid(dedication_uuid: string): Observable<any> {
    return this.http.get(`${this.url}/dedication/${dedication_uuid}`);
  }

  //actualizar
  updateDedication(data: any): Observable<any> {
    return this.http.post(`${this.url}/dedication/update`, data);
  }


}
