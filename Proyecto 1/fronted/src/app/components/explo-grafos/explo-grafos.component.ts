import { Component, AfterViewInit } from '@angular/core';
import { DataSet, Network, Edge, Node } from 'vis-network/standalone';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-graph-explorer',
  templateUrl: './explo-grafos.component.html',
  styleUrls: ['./explo-grafos.component.css']
})

export class ExploGrafosComponent implements AfterViewInit {
  constructor(private dataService: DataService) { }
  limite: number = 10; 
  ngAfterViewInit(): void {

    this.dataService.grafos(this.limite).subscribe({
      next: (data) => this.cargarGraph(data),
      error: (err) => alert('Error al cargar el grafo'+err)
    });

  }

  cargarGraph(data: any): void {
    console.log(data);
    const nodes = new DataSet<Node>(data.nodes.map((n: any) => ({
      id: n.id,
      label: n.label,
      group: n.group
    })));
  
    const edges = new DataSet<Edge>(data.edges.map((e: any, index: number) => ({
      id: index,
      from: e.from,
      to: e.to,
      label: e.label,
      arrows: 'to'
    })));
  
    const container = document.getElementById('graph')!;
    const options = {
      nodes: {
        shape: 'dot',
        size: 15,
        font: { size: 14 }
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 0.7 }
        },
        font: { align: 'middle' }
      },
      groups: {
        Applicant: { color: { background: '#4e79a7' } },
        Career: { color: { background: '#59a14f' } },
        Institution: { color: { background: '#f28e2c' } }
      },
      physics: {
        stabilization: false
      }
    };
  
    new Network(container, { nodes, edges }, options);
  }

  buscar(): void {
    const container = document.getElementById('graph');
    if (container) container.innerHTML = ''; // limpiar grafo anterior (opcional)
  
    this.dataService.grafos(this.limite).subscribe({
      next: (data) => this.cargarGraph(data),
      error: (err) => alert('Error al cargar el grafo: ' + err)
    });
  }
  
}
