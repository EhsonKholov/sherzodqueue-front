import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(private http: HttpClient) {}

  getRecord(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : '';
    return this.http.get(environment.URI + `api/records?${s}Page=${Page}&PerPage=${PerPage}`);
  }

  addRecord(customer: any) {
    return this.http.post(environment.URI + `api/records`, customer)
  }

  editRecord(customer: any) {
    return this.http.put(environment.URI + `api/records`, customer)
  }

  getRecordById(id: number) {
    return this.http.get(environment.URI + `api/records/${id}`)
  }

  deleteRecord(id: number) {
    return this.http.delete(environment.URI + `api/records/${id}`)
  }

}
