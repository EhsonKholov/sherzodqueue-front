import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) {}

  getServices(body: any) {
    return this.http.post(environment.URI + `api/service/search`, body);
  }

  addService(service: any) {
    return this.http.post(environment.URI + `api/service/create`, service)
  }

  editService(service: any) {
    return this.http.put(environment.URI + `api/service/update?Id=${service?.id}`, service)
  }

  getServiceById(id: number) {
    return this.http.get(environment.URI + `api/service/get/${id}`)
  }

  deleteService(id: number) {
    return this.http.delete(environment.URI + `api/service/delete/${id}`)
  }
}
