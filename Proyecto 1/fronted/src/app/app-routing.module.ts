import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExploGrafosComponent } from './components/explo-grafos/explo-grafos.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { ImportCSVComponent } from './components/import-csv/import-csv.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'grafos', component: ExploGrafosComponent },
  { path: 'buscador', component: BuscadorComponent },
  { path: 'import-csv', component: ImportCSVComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

