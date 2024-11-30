import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) {}

  getServices(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : '';
    return this.http.get(environment.URI + `api/services?${s}Page=${Page}&PerPage=${PerPage}`);
  }

  addService(service: any) {
    return this.http.post(environment.URI + `api/services`, service)
  }

  editService(service: any) {
    return this.http.put(environment.URI + `api/services/${service?.id}`, service)
  }

  getServiceById(id: number) {
    return this.http.get(environment.URI + `api/services/${id}`)
  }

  deleteService(id: number) {
    return this.http.delete(environment.URI + `api/services/${id}`)
  }

  getActivesServices() {
    return this.http.get('api/services/active')
  }
}
