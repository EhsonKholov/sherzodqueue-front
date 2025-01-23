import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {}

  getEmployees(body: any) {
    return this.http.post(environment.URI + `api/employee/search`, body);
  }

  getEmployeesList(body: any) {
    return this.http.post(environment.URI + `api/employee/list`, body);
  }

  addEmployee(customer: any) {
    return this.http.post(environment.URI + `api/employee/create`, customer)
  }

  editEmployee(id: number, customer: any) {
    return this.http.put(environment.URI + `api/employee/update?employeeId=${id}`, customer)
  }

  getEmployeeById(id: number) {
    return this.http.get(environment.URI + `api/employee?Id=${id}`)
  }

  deleteEmployee(id: number) {
    return this.http.delete(environment.URI + `api/employee?delete?employeeId=${id}`)
  }
}
