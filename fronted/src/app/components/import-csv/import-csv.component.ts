import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})
export class ImportCSVComponent {

  constructor(private dataService: DataService) { }
  selectedFile: File | null = null;
  backendData: any = null;
  opcionSeleccionada: number = 0;
  opcionesMostrar: string[] = [
    '	MongoDB ',
    '	Neo4J '
  ];
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadCSV(): void {
    if (!this.selectedFile) return;
      this.dataService.importCSV(this.selectedFile,this.opcionSeleccionada).subscribe({
        next: (res: { message: any; }) => {
          this.backendData = res;
          alert(res.message)
        },
        error: (err: { error: any; message: any; }) => {
          this.backendData = err.error;
          alert(err.message)
        }
      });
  }

  selectDataBase(event: any): void {
    this.opcionSeleccionada = +event.target.value;
  }
}
