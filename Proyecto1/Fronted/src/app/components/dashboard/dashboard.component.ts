import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private http: HttpClient) {}

  selectedFile: File | null = null;
  backendData: any = null;
  mostrarGraficas: boolean = true;

  toggleGraficas(event: any): void {
    this.mostrarGraficas = event.target.value === 'true';
  }
  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadCSV(): void {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('/api/csv/upload', formData).subscribe({
      next: res => {
        alert('Archivo subido correctamente');
        this.backendData = res;
      },
      error: err => {
        alert('Error al subir el archivo');
        this.backendData = err.error;
      }
    });
  }

  barData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Ingeniería', 'Arquitectura', 'Química'],
    datasets: [
      { data: [120, 90, 150], label: 'Aprobados' }
    ]
  };

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

  pieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Privada', 'Pública'],
    datasets: [
      { data: [300, 200], backgroundColor: ['#4e79a7', '#f28e2c'] }
    ]
  };

  pieOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true
  };
}
