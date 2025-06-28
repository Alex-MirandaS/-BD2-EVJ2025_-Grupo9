import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExploGrafosComponent } from './components/explo-grafos/explo-grafos.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { ImportCSVComponent } from './components/import-csv/import-csv.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExploGrafosComponent,
    BuscadorComponent,
    ImportCSVComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
