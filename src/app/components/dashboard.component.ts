import { Component } from '@angular/core';
import { WorldMapComponent } from './world-map.component';
import { TreemapComponent } from './treemap.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WorldMapComponent, TreemapComponent],
  template: `
    <app-world-map></app-world-map>
    <app-treemap></app-treemap>
  `
})
export class DashboardComponent {}
