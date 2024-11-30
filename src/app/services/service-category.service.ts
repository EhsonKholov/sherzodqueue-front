import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {

  constructor(private http: HttpClient) {
  }

  getServicesCategory(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : '';
    return this.http.get(environment.URI + `api/service-category?${s}Page=${Page}&PerPage=${PerPage}`);
  }

  addServiceCategory(service: any) {
    return this.http.post(environment.URI + `api/service-category`, service)
  }

  editServiceCategory(service: any) {
    return this.http.put(environment.URI + `api/service-category/${service?.id}`, service)
  }

  getServiceCategoryById(id: number) {
    return this.http.get(environment.URI + `api/service-category/${id}`)
  }

  deleteServiceCategory(id: number) {
    return this.http.delete(environment.URI + `api/service-category/${id}`)
  }
}
