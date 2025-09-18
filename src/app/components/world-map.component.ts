import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CovidService } from '../../app/services/covid.service';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [NgxEchartsDirective],
  template: `<div echarts [options]="chartOptions" class="chart"></div>`,
  styles: [`.chart{width:100%;height:500px}`]
})
export class WorldMapComponent implements OnChanges {
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
    const values = data
      .map(d =>
        this.type === 'confirmed' ? d.totalConfirmed :
        this.type === 'deaths'    ? d.totalDeaths    : d.totalRecovery
      )
      .filter(v => v != null && !isNaN(v));   

    const maxVal = values.length ? Math.max(...values) : 0;

    this.chartOptions = {
      tooltip: { trigger: 'item' },
      visualMap: {
        min: 0,
        max: maxVal || 1, 
        text: ['High', 'Low'],
        calculable: true
      },
      series: [{
        name: this.type,
        type: 'map',
        map: 'world',
        roam: true,
        data: data.map(d => ({
          name: d.country,
          value: this.type === 'confirmed' ? d.totalConfirmed :
                 this.type === 'deaths'    ? d.totalDeaths    : d.totalRecovery || 0
        }))
      }]
    };
  });
}

}
