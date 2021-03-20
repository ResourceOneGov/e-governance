import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() profile: string;
  @Input() count: number;

  charts: string[] = ['Pie', 'Bar', 'Line'];
  selectedChart: string;

  constructor() { }

  ngOnInit(): void {
    this.selectedChart = 'Pie';
  }

}
