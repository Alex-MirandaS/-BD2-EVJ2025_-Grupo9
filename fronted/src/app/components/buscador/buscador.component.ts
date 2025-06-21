import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent {
  constructor(private dataService: DataService){}
  id = '';
  carrera = '';
  institucion = '';
  materia='';
  departamento = '';
  municipio = '';
  genero = '';
  birth_year = '';
  admission_year='';
  evaluation_number='';
  aprobado='';
  resultados: string[] = [];
  backendData: any = null;
  mostrarTabla: boolean = false;
  columnas: string[] = [];
  tabla: any[] = [];
  carreras: string[] = [];
  instituciones: string[] = [];

  ngOnInit(): void {
    this.dataService.getCarreras().subscribe(data => {
      this.carreras = data;
    });

    this.dataService.getInstitucion().subscribe(data => {
      this.instituciones = data;
    });
  }
  
  buscar() {
    const params: any = {};

    if (this.id.trim() !== '') params.code = this.id.trim();
    if (this.carrera.trim() !== '') params.career = this.carreras[+this.carrera]; 
    if (this.institucion.trim() !== '') params.institution = this.instituciones[+this.institucion];
    if (this.materia.trim() !== '') params.subject = this.materia.trim();
    if (this.departamento.trim() !== '') params.department = this.departamento.trim();
    if (this.municipio.trim() !== '') params.municipality = this.municipio.trim();
    if (this.genero.trim() !== '') params.gender = this.genero.trim();
    if (this.birth_year !== '') params.birth_year = this.birth_year;
    if (this.admission_year !== '') params.admission_year = this.admission_year;
    if (this.evaluation_number !== '') params.evaluation_number = this.evaluation_number;
    if (this.aprobado !== '' && this.aprobado !== 'null') params.passed = this.aprobado;
console.log(params);
    this.dataService.buscadorAvanzado(params).subscribe({
      next: data => {
        console.log(data);
        this.backendData = data;
        this.mostrarTabla = true;
  
        if (Array.isArray(data) && data.length > 0) {
          this.columnas = Object.keys(data[0]);
          this.tabla = data;
        } else {
          this.columnas = [];
          this.tabla = [];
        }
      },
      error: err => {
        alert('Error al realizar la búsqueda');
        console.error(err);
        this.backendData = err.error;
        this.mostrarTabla = false;
        this.columnas = [];
        this.tabla = [];
      }
    });
  }
}