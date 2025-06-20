import { Component, AfterViewInit } from '@angular/core';
import { DataSet, Network } from 'vis-network/standalone';

@Component({
  selector: 'app-graph-explorer',
  templateUrl: './explo-grafos.component.html',
  styleUrls: ['./explo-grafos.component.css']
})

export class ExploGrafosComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const nodes = new DataSet([
      { id: 1, label: 'Aspirante A1' },
      { id: 2, label: 'Ingeniería Química' },
      { id: 3, label: 'Mixco' }
    ]);

    const edges = new DataSet([
      { id: 1, from: 1, to: 2 },
      { id: 2, from: 1, to: 3 }
    ]);

    const container = document.getElementById('graph')!;
    const data = { nodes, edges };
    new Network(container, data, {});
  }
}