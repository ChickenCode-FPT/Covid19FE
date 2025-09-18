import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import worldJson from './assets/world.json';

(worldJson as any).features.forEach((f: any) => {
  if (f.properties?.name) {
    f.properties.name = f.properties.name.toLowerCase();
  }
});

echarts.registerMap('world', worldJson as any);
bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(NgxEchartsModule.forRoot({ echarts })),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
