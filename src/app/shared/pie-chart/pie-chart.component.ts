import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() title: string;
  @Input() chartOptions: any;

  highcharts = Highcharts;

  constructor() { }

  ngOnInit(): void {
  }
  

}
