import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {}

  getEmployees(Query: any, Page: number, PerPage: number) {
    let s = !!Query ? `Query=${Query}&` : '';
    return this.http.get(environment.URI + `api/employees?${s}Page=${Page}&PerPage=${PerPage}`);
  }

  addEmployee(customer: any) {
    return this.http.post(environment.URI + `api/employees`, customer)
  }

  editEmployee(id: number, customer: any) {
    return this.http.put(environment.URI + `api/employees/${id}`, customer)
  }

  getEmployeeById(id: number) {
    return this.http.get(environment.URI + `api/employees/${id}`)
  }

  deleteEmployee(id: number) {
    return this.http.delete(environment.URI + `api/employees/${id}`)
  }

  getActivesEmployees() {
    return this.http.get(environment.URI + 'api/employees/active')
  }
}
