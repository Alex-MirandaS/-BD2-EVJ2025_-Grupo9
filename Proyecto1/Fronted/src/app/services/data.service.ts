import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  protected apiUrl = 'http://localhost:3000/api/';

  constructor(protected http: HttpClient) { 
  }
/*
  add(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
*/

  aspiranteTipoInstitución(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  cantidadAprobadoMateria(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  aprobadosCarreraAnio(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  porcentajeAprobacionMateria(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  promedioEdadCarrera(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  creacionColeccionAuxiliar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  promedioEdadAprobadosCarreraInstitucion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  distribucionAprobadosMunicipioCarrera(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  cantidadEvaluacionesMesMateriaPublica(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  topCarrerasDemandadasAspirantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }
//CORRELATIVO ASPIRANTE
  historialDesempenioAspirante(correlativo:String): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${correlativo}`);
  }

  distribucionSexoInstitucion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  tasaAprobacionEdad(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  promedioIntentoMateria(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

//CORRELATIVO ASPIRANTE
  historialAspirante(correlativo:String): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${correlativo}`);
  }
  carrerasAspirantesReprobados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  getCarreras(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

  getInstitucion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'');
  }

}