import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) {}

  getCustomers(body: any) {
    return this.http.post(environment.URI + `api/customer/search`, body);
  }

  getCustomersList(body: any, loader?: boolean) {
    const headers = new HttpHeaders({ 'X-Show-Loader': 'false' });
    return this.http.post(environment.URI + `api/customer/list`, body, {headers});
  }

  addCustomer(customer: any) {
    return this.http.post(environment.URI + `api/customer/create`, customer)
  }

  editCustomer(id: number, customer: any) {
    return this.http.put(environment.URI + `api/customer/update?customerId=${id}`, customer)
  }

  getCustomerById(id: number) {
    return this.http.get(environment.URI + `api/customer/get?id=${id}`)
  }

  deleteCustomer(id: number) {
    return this.http.delete(environment.URI + `api/customer/delete?customerId={id}`)
  }
}
