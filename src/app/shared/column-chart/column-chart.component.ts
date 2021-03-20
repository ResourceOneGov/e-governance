import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss']
})
export class ColumnChartComponent implements OnInit {
  @Input() chartOptions;

  highcharts = Highcharts;

  constructor() { }

  ngOnInit(): void {
  }

}
