import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  highcharts = Highcharts;
  chartOptions = {   
    chart: {
       type: 'bar'
    },
    legend : {
       layout: 'vertical',
       align: 'left',
       verticalAlign: 'top',
       x: 250,
       y: 100,
       floating: true,
       borderWidth: 1,
      
       backgroundColor: ('#FFFFFF'), shadow: true
    },
    xAxis:{
      categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'], 
      title: {
        text: null
      } 
    },
    yAxis : {
       min: 0, title: {
          text: 'Population (millions)', align: 'high'
       },
       labels: {
          overflow: 'justify'
       }
    },
    tooltip : {
       valueSuffix: ' millions'
    },
    plotOptions : {
       bar: {
          dataLabels: {
             enabled: true
          }
       }
    },
    credits:{
       enabled: false
    },
    series: [
       {
          name: 'Year 1800',
          data: [107, 31, 635, 203, 2]
       }, 
       {
          name: 'Year 1900',
          data: [133, 156, 947, 408, 6]
       }, 
       {
          name: 'Year 2008',
          data: [973, 914, 4054, 732, 34]      
       }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

}
