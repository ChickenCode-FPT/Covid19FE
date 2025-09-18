import { Component, OnInit } from '@angular/core';
import { CovidService } from '../../app/services/covid.service';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-treemap',
  standalone: true, 
  imports: [NgxEchartsDirective],
  template: `<div echarts [options]="chartOptions" class="chart"></div>`,
  styles: [`.chart{width:100%;height:500px}`]
})
export class TreemapComponent implements OnInit {
  chartOptions: EChartsOption = {};

  constructor(private covidService: CovidService) {}

  ngOnInit() {
    this.covidService.getSummary().subscribe(data => {
      this.chartOptions = {
        tooltip: { formatter: '{b}: {c}' },
        series: [
          {
            type: 'treemap',
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
