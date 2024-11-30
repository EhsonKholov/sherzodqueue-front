import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ChairsService {

  constructor(private http: HttpClient) {}

  getChairs(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : '';
    return this.http.get(environment.URI + `api/chairs?${s}Page=${Page}&PerPage=${PerPage}`);
  }

  addChairs(customer: any) {
    return this.http.post(environment.URI + `api/chairs`, customer)
  }

  editChairs(id: number, customer: any) {
    return this.http.put(environment.URI + `api/chairs/${id}`, customer)
  }

  getChairsById(id: number) {
    return this.http.get(environment.URI + `api/chairs/${id}`)
  }

  deleteChairs(id: number) {
    return this.http.delete(environment.URI + `api/chairs/${id}`)
  }

}
