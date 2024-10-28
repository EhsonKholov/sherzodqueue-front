import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) {}

  getCustomers(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : '';
    return this.http.get(environment.URI + `api/customers?${s}Page=${Page}&PerPage=${PerPage}`);
  }

  addCustomer(customer: any) {
    return this.http.post(environment.URI + `api/customers`, customer)
  }

  getCustomerById(id: number) {
    return this.http.get(environment.URI + `api/customers/${id}`)
  }

  deleteCustomer(id: number) {
    return this.http.delete(environment.URI + `api/customers/${id}`)
  }
}
