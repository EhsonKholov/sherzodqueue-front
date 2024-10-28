import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) {}

  getCustomers(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : '';
    return this.http.get(`api/customers?${s}Page=${Page}&PerPage=${PerPage}`);
  }

  addCustomer(customer: any) {
    return this.http.post(`api/customers`, customer)
  }

  getCustomerById(id: number) {
    return this.http.get(`api/customers/${id}`)
  }

  deleteCustomer(id: number) {
    return this.http.delete(`api/customers/${id}`)
  }
}
