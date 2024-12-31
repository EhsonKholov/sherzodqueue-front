import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(private http: HttpClient) {}

  getRecord(body: any) {
    return this.http.post(environment.URI + 'api/record/search', body);
  }

  addRecord(customer: any) {
    return this.http.post(environment.URI + `api/records`, customer)
  }

  editRecord(id: number, customer: any) {
    return this.http.put(environment.URI + `api/records/${id}`, customer)
  }

  getRecordById(id: number) {
    return this.http.get(environment.URI + `api/records/${id}`)
  }

  deleteRecord(id: number) {
    return this.http.delete(environment.URI + `api/records/${id}`)
  }

  getAvailableTimes(date: Date, employeeId: number, chairId: number) {
    return this.http.get(environment.URI + `api/records/get-available-times?date=${date}&employeeId=${employeeId}&chairId=${chairId}`)
  }
}
