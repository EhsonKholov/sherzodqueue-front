import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomers(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : ''
    return this.http.get(`/api/customers?${s}&Page=${Page}&PerPage=${PerPage}`)
  }

}
