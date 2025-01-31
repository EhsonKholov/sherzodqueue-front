import {Routes} from '@angular/router';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {CustomersComponent} from './pages/admin/customers/customers.component';
import {EmployeeComponent} from './pages/admin/employee/employee.component';
import {RecordsComponent} from './pages/admin/records/records.component';
import {ServicesComponent} from './pages/admin/services/services.component';
import {RecordsHistoryComponent} from './pages/admin/records-history/records-history.component';
import {authGuard} from './services/guard/auth.guard';
import {ServiceCategoryComponent} from './pages/admin/service-category/service-category.component';
import {ChairsComponent} from './pages/admin/chairs/chairs.component';
import {EmployeeSalaryComponent} from './pages/admin/employee-salary/employee-salary.component';
import {DashboardComponent} from './pages/admin/dashboard/dashboard.component';
import {TotalIncomeComponent} from './pages/admin/total-income/total-income.component';
import {UsersComponent} from './pages/admin/users/users.component';
import {RoleGuard} from './services/guard/role.guard';

export const routes: Routes = [
  {path: '', title: 'Главная', redirectTo: '/admin/records', /*component: HomeComponent,*/pathMatch: 'full'},
  {
    path: 'admin', loadComponent: () => import('./pages/admin/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: '/admin/records', pathMatch: 'full', canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'dashboard', title: 'Dashboard', component: DashboardComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'records', title: 'Записи', component: RecordsComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN','Employee']}},
      {path: 'records-history', title: 'История записей', component: RecordsHistoryComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN','Employee']}},
      {path: 'customers', title: 'Клиенты', component: CustomersComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'employees', title: 'Сотрудники', component: EmployeeComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'services', title: 'Услуги', component: ServicesComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'services/category', title: 'Категории услуг', component: ServiceCategoryComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'chairs', title: 'Кресла', component: ChairsComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'employee-salary', title: 'Зарплата сотрудников', component: EmployeeSalaryComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'total-income', title: 'Общий доход', component: TotalIncomeComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
      {path: 'users', title: 'Пользователи', component: UsersComponent, canActivate: [authGuard, RoleGuard], data: {roles: ['ADMIN']}},
    ]
  },
  {
    path: 'admin/login',
    title: 'Логин',
    loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent)
  },
  {path: '**', title: 'Not Found', canActivate: [authGuard], component: NotFoundComponent},
];
