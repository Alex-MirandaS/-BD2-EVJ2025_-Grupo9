import { Component } from '@angular/core';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent {
  id = '';
  carrera = '';
  institucion = '';
  resultados: string[] = [];

  buscar() {
    // Simulación de búsqueda, aquí deberías llamar a tu API
    this.resultados = [`Aspirante encontrado: ${this.id} - ${this.carrera} - ${this.institucion}`];
  }
}