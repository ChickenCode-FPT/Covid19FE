import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class TreemapComponent implements OnChanges {
  @Input() type: 'confirmed' | 'deaths' | 'recovered' = 'confirmed';
  chartOptions: EChartsOption = {};

  constructor(private covidService: CovidService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['type']) {
      this.loadData();
    }
  }

  private loadData() {
    this.covidService.getSummary(this.type).subscribe(data => {
      this.chartOptions = {
        tooltip: { formatter: '{b}: {c}' },
        series: [{
          type: 'treemap',
          data: data.map(d => ({
            name: d.country,
            value: this.type === 'confirmed' ? d.totalConfirmed :
                   this.type === 'deaths' ? d.totalDeaths : d.totalRecovery
          }))
        }]
      };
    });
  }
}
