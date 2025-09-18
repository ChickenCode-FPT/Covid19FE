import { Component, OnInit } from '@angular/core';
import { CovidService, LocationSummary } from '../../app/services/covid.service';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-world-map',
  standalone: true, 
  imports: [NgxEchartsDirective],
  template: `<div echarts [options]="chartOptions" class="chart"></div>`,
  styles: [`.chart{width:100%;height:500px}`]
})
export class WorldMapComponent implements OnInit {
  chartOptions: EChartsOption = {};

  constructor(private covidService: CovidService) {}

  ngOnInit() {
    this.covidService.getSummary().subscribe(data => {
      this.chartOptions = {
        tooltip: { trigger: 'item' },
        visualMap: {
          min: 0,
          max: Math.max(...data.map(d => d.totalConfirmed)),
          text: ['High', 'Low'],
          realtime: false,
          calculable: true
        },
        series: [
          {
            name: 'Confirmed',
            type: 'map',
            map: 'world',
            roam: true,
            data: data.map(d => ({
              name: d.country,
              value: d.totalConfirmed
            }))
          }
        ]
      };
    });
  }
}
