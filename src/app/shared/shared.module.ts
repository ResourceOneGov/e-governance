import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList, MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PieChartComponent } from './pie-chart/pie-chart.component';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './chart/chart.component';
import { FormsModule } from '@angular/forms';
import { FormioModule } from 'angular-formio';
import { MatSelectModule } from '@angular/material/select';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ColumnChartComponent } from './column-chart/column-chart.component';
import { MatCardModule } from '@angular/material/card';
import { CountCardComponent } from './count-card/count-card.component';


@NgModule({
  declarations: [PieChartComponent, ChartComponent, BarChartComponent, LineChartComponent, ColumnChartComponent, CountCardComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatMenuModule,
    HighchartsChartModule,
    FormsModule,
    FormioModule,
    MatSelectModule,
    MatCardModule
  ],
  exports: [
    PieChartComponent,
    ChartComponent,
    BarChartComponent,
    CountCardComponent,
    ColumnChartComponent
  ]
})
export class SharedModule { }
