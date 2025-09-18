import { Component } from '@angular/core';
import { WorldMapComponent } from './world-map.component';
import { TreemapComponent } from './treemap.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WorldMapComponent, TreemapComponent],
  template: `
    <div class="page">
      <!-- Header buttons -->
      <div class="controls">
        <button (click)="setDataType('Confirmed')">Confirmed</button>
        <button (click)="setDataType('Active')">Active</button>
        <button (click)="setDataType('Recovered')">Recovered</button>
        <button (click)="setDataType('Deaths')">Deaths</button>
        <button (click)="setDataType('DailyIncrease')">Daily Increase</button>
      </div>

      <!-- Map -->
      <div class="map-container">
        <h2># of Cases World wide</h2>
        <app-world-map [dataType]="dataType"></app-world-map>  <!-- Truyền dataType vào WorldMapComponent -->
      </div>

      <!-- Treemap -->
      <div class="treemap-container">
        <h3>Treemap of Countries</h3>
        <p>
          The Treemap shows the number of Cases in Different countries<br />
          and their percent of total cases worldwide
        </p>
        <app-treemap [dataType]="dataType"></app-treemap>
      </div>
    </div>
  `,  
  styles: [`
    .page {
      background: #f6fef9;
      padding: 20px;
    }
    .controls {
      margin-bottom: 10px;
    }
    .controls button {
      margin-right: 8px;
      margin-bottom: 5px;
      padding: 6px 12px;
      border: 1px solid #ccc;
      background: #f9f9f9;
      cursor: pointer;
    }
    .controls button:hover {
      background: #e0f0ff;
    }
    .map-container, .treemap-container {
      margin-top: 20px;
      text-align: center;
    }
    h2, h3 {
      margin-bottom: 8px;
    }
  `]
})
export class DashboardComponent {
  dataType: string = 'Confirmed';

  setDataType(type: string) {
    this.dataType = type;
  }
}
