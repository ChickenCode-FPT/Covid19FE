import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface LocationSummary {
  locationId: number;
  country: string;
  province: string | null;
  totalConfirmed: number;
  totalDeaths: number;
  totalRecovered: number;
}

interface ConfirmedRecord {
  RecordId: number;
  LocationId: number;
  RecordDate: string;
  Quantity: number;
  Country: string;
}

interface Location {
  LocationId: number;
  CountryRegion: string;
  ProvinceState: string | null;
  Latitude: number;
  Longitude: number;
}

export interface CovidSummaryResult {
  summaries: LocationSummary[];
  confirmedCount: number;
  locationsCount: number;
}

export interface CountrySummary {
  country: string;
  totalConfirmed: number;
  totalDeaths: number;
  totalRecovered: number;
}


@Injectable({ providedIn: 'root' })
export class CovidService {
  private confirmedUrl = 'https://localhost:7137/odata/Confirmed';
  private locationsUrl = 'https://localhost:7137/odata/Locations';
  private confirmedCountUrl = 'https://localhost:7137/odata/Confirmed/$count';
  private locationsCountUrl = 'https://localhost:7137/odata/Locations/$count';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<LocationSummary[]> {
    return forkJoin({
      confirmed: this.http.get<{ value: ConfirmedRecord[] }>(this.confirmedUrl),
      locations: this.http.get<{ value: Location[] }>(this.locationsUrl)
    }).pipe(
      map(({ confirmed, locations }) => {
        console.log('Locations:', locations.value);
      console.log('Confirmed:', confirmed.value);
       // Tính tổng ca nhiễm theo CountryRegion
      const confirmedMap = new Map<string, number>();
      confirmed.value.forEach(record => {
        const prev = confirmedMap.get(record.LocationId.toString()) || 0;
        confirmedMap.set(record.LocationId.toString(), prev + record.Quantity);
      });
        console.log('Confirmed Map:', confirmedMap);
        // Gộp thông tin vào LocationSummary
        const summaries: LocationSummary[] = locations.value.map(loc => ({
          locationId: loc.LocationId,
          country: loc.CountryRegion,
          province: loc.ProvinceState,
          totalConfirmed: confirmedMap.get(loc.CountryRegion) || 0,
          totalDeaths: 0,    
          totalRecovered: 0   
        }));
        console.log('Summaries:', summaries);
        return summaries;
      })
    );
  }

  getSummaryWithCounts(): Observable<CovidSummaryResult> {
    return forkJoin({
      confirmed: this.http.get<{ value: ConfirmedRecord[] }>(this.confirmedUrl),
      locations: this.http.get<{ value: Location[] }>(this.locationsUrl),
      confirmedCount: this.http.get(this.confirmedCountUrl, { responseType: 'text' }),
      locationsCount: this.http.get(this.locationsCountUrl, { responseType: 'text' })
    }).pipe(
      map(({ confirmed, locations, confirmedCount, locationsCount }) => {
        const confirmedMap = new Map<number, number>();
        confirmed.value.forEach(record => {
          const prev = confirmedMap.get(record.LocationId) || 0;
          confirmedMap.set(record.LocationId, prev + record.Quantity);
        });

        const summaries = locations.value.map(loc => ({
          locationId: loc.LocationId,
          country: loc.CountryRegion,
          province: loc.ProvinceState,
          totalConfirmed: confirmedMap.get(loc.LocationId) || 0,
          totalDeaths: 0,
          totalRecovered: 0
        }));

        return {
          summaries,
          confirmedCount: parseInt(confirmedCount, 10),
          locationsCount: parseInt(locationsCount, 10)
        };
      })
    );
  }
  getSummaryGroupedByCountry(): Observable<LocationSummary[]> {
  return forkJoin({
    confirmed: this.http.get<{ value: ConfirmedRecord[] }>(this.confirmedUrl),
    locations: this.http.get<{ value: Location[] }>(this.locationsUrl)
  }).pipe(
    map(({ confirmed, locations }) => {
      // Bước 1: Tạo một Map để nhóm các LocationId theo CountryRegion
      const countryToLocationIds = new Map<string, number[]>();

      locations.value.forEach(loc => {
        const list = countryToLocationIds.get(loc.CountryRegion) || [];
        list.push(loc.LocationId);
        countryToLocationIds.set(loc.CountryRegion, list);
      });

      // Bước 2: Tính tổng Quantity (ca nhiễm) theo từng LocationId
      const confirmedMap = new Map<number, number>();
      confirmed.value.forEach(record => {
        confirmedMap.set(record.LocationId, record.Quantity);
      });

      // Bước 3: Tính tổng ca nhiễm cho từng quốc gia và lấy ngẫu nhiên một LocationId làm đại diện
      const countryTotals = new Map<string, { totalConfirmed: number, representativeLocationId: number }>();

      // Duyệt qua tất cả các LocationIds của từng quốc gia và cộng dồn tổng ca nhiễm
      countryToLocationIds.forEach((locationIds, country) => {
        let totalConfirmed = 0;

        // Cộng dồn tổng ca nhiễm cho tất cả các LocationId của quốc gia
        locationIds.forEach(locationId => {
          totalConfirmed += confirmedMap.get(locationId) || 0;
        });

        // Chọn một LocationId ngẫu nhiên trong danh sách LocationIds của quốc gia
        const representativeLocationId = locationIds[Math.floor(Math.random() * locationIds.length)];

        countryTotals.set(country, {
          totalConfirmed,
          representativeLocationId
        });
      });

      // Bước 4: Trả về các quốc gia và tổng ca nhiễm của chúng
      const summaries: LocationSummary[] = Array.from(countryTotals.entries()).map(([country, { totalConfirmed, representativeLocationId }]) => ({
        locationId: representativeLocationId,  // Lấy LocationId đại diện
        country,
        province: null,  // Không cần province ở đây nếu chỉ nhóm theo quốc gia
        totalConfirmed,
        totalDeaths: 0,  // Bạn có thể tính thêm totalDeaths nếu cần
        totalRecovered: 0  // Bạn có thể tính thêm totalRecovered nếu cần
      }));

      console.log('Summariessss:', summaries); // Debug kết quả
      return summaries;
    })
  );
}


}
