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

  getRecordsList(body: any) {
    return this.http.post(environment.URI + 'api/record/list', body);
  }

  addRecord(record: any) {
    return this.http.post(environment.URI + `api/record/create`, record)
  }

  editRecord(id: number, customer: any) {
    return this.http.put(environment.URI + `api/record/update?recrodId=${id}`, customer)
  }

  getRecordById(id: number) {
    return this.http.get(environment.URI + `api/record/get?id=${id}`)
  }

  deleteRecord(id: number) {
    return this.http.delete(environment.URI + `api/record/delete?recrodId=${id}`)
  }

  getAvailableTimes(body: any) {
    return this.http.post(environment.URI + `api/record/get-available-times`, body)
  }
}
