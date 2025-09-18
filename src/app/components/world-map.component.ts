import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class WorldMapComponent implements OnInit, OnChanges {
  @Input() dataType: string = 'Confirmed';
  chartOptions: EChartsOption = {};

  constructor(private covidService: CovidService) {}

  ngOnInit(): void {
    this.updateChart(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataType']) {
      this.updateChart(); 
    }
  }

  // Phương thức cập nhật biểu đồ với loại dữ liệu hiện tại
  updateChart(): void {
    this.covidService.getSummaryGroupedByCountry().subscribe((data: LocationSummary[]) => {
      // Lọc bỏ các giá trị không phải là number và null
      const maxValue = Math.max(...data
        .map(d => this.getValidValue(d)) 
        .filter((value): value is number => value !== null && value !== undefined)
      );

      this.chartOptions = {
        tooltip: { trigger: 'item' },
        visualMap: {
          min: 0,
          max: maxValue,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true
        },
        series: [
          {
            name: this.dataType,
            type: 'map',
            map: 'world',
            roam: true,
            data: data.map(d => ({
              name: this.normalizeCountryName(d.country),
              value: this.getValidValue(d)
            }))
          }
        ]
      };
    });
  }

  getValidValue(data: LocationSummary): number {
    const value = data[this.getValueField() as keyof LocationSummary];
    return typeof value === 'number' ? value : 0;
  }

  getValueField(): string {
    switch (this.dataType) {
      case 'Deaths':
        return 'totalDeaths';
      case 'Active':
        return 'totalActive'; 
      case 'Recovered':
        return 'totalRecovered'; 
      case 'DailyIncrease':
        return 'newCases';
      default:
        return 'totalConfirmed';
    }
  }

  normalizeCountryName(country: string): string {
    return country ? country.toLowerCase() : ''; 
  }
}
