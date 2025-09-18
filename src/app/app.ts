import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // NgxEchartsDirective  
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = signal('covid-dashboard');

  chartOptions = {
    title: {
      text: 'World COVID Cases',
      left: 'center'
    },
    series: [
      {
        type: 'map',
        map: 'world'
      }
    ]
  };
}
