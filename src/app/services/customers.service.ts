import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) {}

  getCustomers(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : '';
    return this.http.get(`http://94.241.142.207:6099/api/customers?${s}Page=${Page}&PerPage=${PerPage}`);
  }

}
