import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
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
export class TreemapComponent implements OnInit, OnChanges {
  @Input() dataType: string = 'Confirmed';
  chartOptions: EChartsOption = {};

  constructor(private covidService: CovidService) {}

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataType']) {
      this.updateChart();
    }
  }

  // Method to update the chart with the selected data type
  updateChart(): void {
    this.covidService.getSummaryGroupedByCountry().subscribe(data => {
      this.chartOptions = {
        tooltip: { formatter: '{b}: {c}' },
        series: [
          {
            type: 'treemap',
            data: data.map(d => ({
              name: d.country,
              value: this.getDataValue(d)  // Get the value based on selected data type
            })),
            label: {
              show: true,
              formatter: '{b}: {c}'  // Display country name and corresponding value
            }
          }
        ]
      };
    });
  }

  // Method to get the value based on the selected data type
  getDataValue(d: any): number {
    switch (this.dataType) {
      case 'Deaths':
        return d.totalDeaths;
      case 'Recovered':
        return d.totalRecovered;
      case 'Active':
        return d.totalActive;
      case 'DailyIncrease':
        return d.dailyIncrease;
      default:
        return d.totalConfirmed;
    }
  }
}
