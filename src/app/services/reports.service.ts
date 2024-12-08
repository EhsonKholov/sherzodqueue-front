import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  getAnnualBudget() {
    return this.http.get(environment.URI + 'api/reports/annual-budget')
  }

  getDailyRecords() {
    return this.http.get(environment.URI + 'api/reports/daily-records')
  }

}
