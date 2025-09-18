import { Component } from '@angular/core';
import { WorldMapComponent } from './world-map.component';
import { TreemapComponent } from './treemap.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WorldMapComponent, TreemapComponent],
  template: `
    <button (click)="currentType='confirmed'">Confirmed</button>
    <button (click)="currentType='deaths'">Deaths</button>
    <button (click)="currentType='recovered'">Recovered</button>

    <app-world-map [type]="currentType"></app-world-map>
    <app-treemap [type]="currentType"></app-treemap>
  `
})
export class DashboardComponent {
  currentType: 'confirmed' | 'deaths' | 'recovered' = 'confirmed';
}
