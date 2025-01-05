import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {

  constructor(private http: HttpClient) {
  }

  getServicesCategory(body: any) {
    return this.http.post(environment.URI + 'api/service-category/search', body);
  }

  getServicesCategoryList(body: any) {
    return this.http.post(environment.URI + 'api/service-category/list', body);
  }

  addServiceCategory(service: any) {
    return this.http.post(environment.URI + `api/service-category/create`, service)
  }

  editServiceCategory(service: any) {
    return this.http.put(environment.URI + `api/service-category/update?Id=${service?.id}`, service)
  }

  getServiceCategoryById(id: number) {
    return this.http.get(environment.URI + `api/service-category/get/${id}`)
  }

  deleteServiceCategory(id: number) {
    return this.http.delete(environment.URI + `api/service-category/delete/${id}`)
  }
}
