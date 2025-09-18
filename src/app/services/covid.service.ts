import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocationSummary {
  locationId: number;
  country: string;
  province: string | null;
  totalConfirmed: number;
  totalDeaths: number;
  totalRecovered: number;
}

@Injectable({ providedIn: 'root' })
export class CovidService {
  private apiUrl = 'https://localhost:7229/DailyData/countries';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<LocationSummary[]> {
    return this.http.get<LocationSummary[]>(this.apiUrl);
  }
}
