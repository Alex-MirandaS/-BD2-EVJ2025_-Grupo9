import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private http: HttpClient, private dataService: DataService) { }

  selectedFile: File | null = null;
  backendData: any = null;
  mostrarGraficas: boolean = true;
  mostrarGraficaBarras: boolean = false;
  mostrarGraficaPie: boolean = true;
  mostrarTabla: boolean = true;
  opcionSeleccionada: number = 0;
  columnas: string[] = [];
  tabla: any[] = [];

  opcionesMostrar: string[] = [
    '	Aspirantes por tipo de institución educativa ',
    ' Cantidad de aprobados por materia ',
    ' Aprobados por carrera y año 2023',
    '	Porcentaje de aprobación por materia ',
    '	Promedio de edad por carrera ',
    '	Creación de colección auxiliar (resumen_carrera) ',
    ' Promedio de edad de aprobados por carrera e institución ',
    ' Distribución de aprobados por municipio y carrera objetivo ',
    '	Evaluaciones por mes y materia (públicas) ',
    '	Top 5 carreras más demandadas (16–18 años) ',
    ' Historial por aspirante con intentos y resultados ',
    ' Distribución por sexo y tipo de institución ',
    '	Tasa de aprobación por edad ',
    '	Número promedio de intentos por materia ',
    ' Historial completo de un aspirante ',
    ' Carreras con más reprobados en primer intento '
  ];

  ngOnInit(): void {
    this.selectData(0);
  }

  cargarGraficas(labels: any, values: any, graphType: number): void {
    switch (graphType) {
      case 1:
        this.mostrarGraficaPie = false;  
        this.mostrarTabla = false;
        this.mostrarGraficaBarras = true;

        this.barData = {
          labels: [...labels],
          datasets: [
            {
              label: 'Consulta de datos',
              data: [...values],
              backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f']
            }
          ]
        };

        break;
      case 2:
        this.mostrarGraficaPie = true;  
        this.mostrarTabla = false;
        this.mostrarGraficaBarras = false;

        this.pieData = {
          labels: [...labels],
          datasets: [
            {
              label: 'Consulta de datos',
              data: [...values],
              backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f']
            }
          ]
        };

        if (this.pieOptions?.plugins?.title) {
          this.pieOptions.plugins.title.text = this.opcionesMostrar[this.opcionSeleccionada] || 'Título del gráfico';
        }
        break;

      default:
        this.mostrarGraficaPie = false;  
        this.mostrarTabla = true;
        this.mostrarGraficaBarras = false;
        this.backendData = labels;
        this.setColumnas(labels);
        break;
    }

  }

  selectConsulta(event: any): void {
    this.opcionSeleccionada = +event.target.value;
    this.selectData(this.opcionSeleccionada);
  }

  selectData(numero: number): void {
    let labels = null;
    let values = null;
    switch (numero) {
      case 0:
        this.dataService.aspiranteTipoInstitución().subscribe(data => {
          labels = data.map(d => d._id);
          values = data.map(d => d.total);
          this.backendData = data;
          this.cargarGraficas(labels, values,2);
        });
        break;
      case 1:
        this.dataService.cantidadAprobadoMateria().subscribe(data => {
          labels = data.map(d => d._id);
          values = data.map(d => d.total_passed);
          this.backendData = data;
          this.cargarGraficas(labels, values,1);
        });
        break;
      case 2:
        this.dataService.aprobadosCarreraAnio().subscribe(data => {//Agregar año
          labels = data.map(d => d.career);
          values = data.map(d => d.total_passed);
          this.backendData = data;
          this.cargarGraficas(labels, values,2);
        });
        break;
      case 3:
        this.dataService.porcentajeAprobacionMateria().subscribe(data => {
          labels = data.map(d => d.subject);
          values = data.map(d => d.approval_rate);
          this.backendData = data;
          this.cargarGraficas(labels, values,1);
        });
        break;
      case 4:
        //PENDIENTE
        break;
      case 5:
        this.dataService.creacionColeccionAuxiliar().subscribe(data => {
          alert('Career summary collection created');
        });
        break;
      case 6:
        this.dataService.promedioEdadAprobadosCarreraInstitucion().subscribe(data => {
          this.cargarGraficas(data, null, 7);
        });
        break;
      case 7:
        this.dataService.distribucionAprobadosMunicipioCarrera().subscribe(data => {
          this.cargarGraficas(data, null, 7);
        });
        break;
      case 8:
        this.dataService.cantidadEvaluacionesMesMateriaPublica().subscribe(data => {
          this.cargarGraficas(data, null, 7);
        });
        break;
      case 9:
        this.dataService.topCarrerasDemandadasAspirantes().subscribe(data => {
          labels = data.map(d => d.career);
          values = data.map(d => d.total_applicants);
          this.backendData = data;
          this.cargarGraficas(labels, values,2);
        });
        break;
      case 10:/*PENDIENTE 5901b2d532957c695af8   TABLA DE TABLAS
            this.dataService.historialDesempenioAspirante().subscribe(data => {
              labels = data.map(d => d.career);
              values = data.map(d => d.total_applicants);
              this.cargarGraficas(labels, values);
            });*/
        this.dataService.historialDesempenioAspirante('5901b2d532957c695af8').subscribe(data => {
          this.cargarGraficas(data, null, 7);
        });
        break;
      case 11:
        this.dataService.distribucionSexoInstitucion().subscribe(data => {
          this.cargarGraficas(data, null, 7);
        });
        break;
      case 12:
        this.dataService.tasaAprobacionEdad().subscribe(data => {
          labels = data.map(d => d.age);
          values = data.map(d => d.approval_rate);
          this.backendData = data;
          this.cargarGraficas(labels, values,1);
        });
        break;
      case 13:
        this.dataService.promedioIntentoMateria().subscribe(data => {
          labels = data.map(d => d.subject);
          values = data.map(d => d.average_attempts);
          this.backendData = data;
          this.cargarGraficas(labels, values,1);
        });
        break;
      case 14:/*PENDIENTE 5901b2d532957c695af8   Agregar como obtener ID
*/
        this.dataService.historialAspirante('5901b2d532957c695af8').subscribe(data => {
          this.cargarGraficas(data, null, 7);
        });
        break;
      case 15:
        this.dataService.carrerasAspirantesReprobados().subscribe(data => {
          labels = data.map(d => d.career);
          values = data.map(d => d.total_failed);
          this.backendData = data;
          this.cargarGraficas(labels, values,2);
        });
        break;
    }
  }

  barData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: '', backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'] }
    ]
  };

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

  pieData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      { data: [], backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'] }
    ]
  };

  pieOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '',
        font: {
          size: 18
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  };

  setColumnas(data: any[]): void {
    if (data.length === 0) this.columnas = [];
    this.columnas = Object.keys(data[0]);
    this.tabla = data;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadCSV(): void {
    this.dataService.importCSV(this.selectedFile, this.backendData);
  }
}
