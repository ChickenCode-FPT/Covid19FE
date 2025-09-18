import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocationSummary {
  locationId: number;
  country: string;
  province: string | null;
  totalConfirmed: number;
  totalDeaths: number;
  totalRecovery: number;
}

@Injectable({ providedIn: 'root' })
export class CovidService {
  private confirmedApi = 'https://localhost:7229/DailyData/countries/confirmed';
  private deathsApi    = 'https://localhost:7203/DailyData/countries/deaths';
  private recoveredApi = 'https://localhost:7242/DailyData/countries/recovered'; // nếu có

  constructor(private http: HttpClient) {}

  getSummary(type: 'confirmed' | 'deaths' | 'recovered'): Observable<LocationSummary[]> {
    let url = this.confirmedApi;
    if (type === 'deaths') url = this.deathsApi;
    if (type === 'recovered') url = this.recoveredApi;

    return this.http.get<LocationSummary[]>(url);
  }
}
