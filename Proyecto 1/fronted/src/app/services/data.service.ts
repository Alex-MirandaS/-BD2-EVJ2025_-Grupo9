import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  protected apiUrl = 'http://localhost:3000/api/query/';

  constructor(protected http: HttpClient) {
  }

  importCSV(selectedFile: File | null, database: number): any {
    if (!selectedFile) return;
    console.log(database);
    let url = 'http://localhost:3000/api/upload';
    if (database === 1) {
      url = 'http://localhost:3000/api/upload/neo4j';
    }
    console.log(url);
    const formData = new FormData();
    formData.append('file', selectedFile);
    return this.http.post(url, formData);
  }

  aspiranteTipoInstitución(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'by-institution-type');
  }

  cantidadAprobadoMateria(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'passed-by-subject');
  }

  aprobadosCarreraAnio(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'passed-by-career-and-year');
  }

  porcentajeAprobacionMateria(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'approval-rate-by-subject');
  }

  promedioEdadCarrera(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'average-age-by-career');
  }

  creacionColeccionAuxiliar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'generate-career-summary');
  }

  promedioEdadAprobadosCarreraInstitucion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'average-age-by-career-and-institution');
  }

  distribucionAprobadosMunicipioCarrera(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'passed-by-municipality-and-career');
  }

  cantidadEvaluacionesMesMateriaPublica(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'evaluations-by-month-and-subject-public');
  }

  topCarrerasDemandadasAspirantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'top-demanded-careers-age-16-18');
  }
  //CORRELATIVO ASPIRANTE
  historialDesempenioAspirante(correlativo: String): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl + 'performance-history'}/${correlativo}`);
  }

  distribucionSexoInstitucion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'gender-distribution-by-institution-type');
  }

  tasaAprobacionEdad(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'approval-rate-by-age');
  }

  promedioIntentoMateria(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'average-attempts-by-subject');
  }

  //CORRELATIVO ASPIRANTE
  historialAspirante(correlativo: String): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl + 'full-history'}/${correlativo}`);
  }
  carrerasAspirantesReprobados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'most-failed-careers-on-first-attempt');
  }

  getCarreras(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/search/careers');
  }

  getInstitucion(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/search/institutions');
  }

  grafos(limit: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/search/neo4j/graph?limit=${limit}`);
  }

  buscadorAvanzado(params: any): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/search', { params });
  }
  
}