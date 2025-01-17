import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ChairsService {

  constructor(private http: HttpClient) {}

  getChairs(body: any) {
    return this.http.post(environment.URI + `api/chair/search`, body);
  }

  getChairsList(body: any) {
    return this.http.post(environment.URI + `api/chair/list`, body);
  }

  addChairs(customer: any) {
    return this.http.post(environment.URI + `api/chair/create`, customer)
  }

  editChairs(id: number, customer: any) {
    return this.http.put(environment.URI + `api/chair/update?chairId=${id}`, customer)
  }

  getChairsById(id: number) {
    return this.http.get(environment.URI + `api/chair/get?id=${id}`)
  }

  deleteChairs(id: number) {
    return this.http.delete(environment.URI + `api/chair/delete?chairId=${id}`)
  }

}
