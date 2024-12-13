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

export const routes: Routes = [
  {path: '', title: 'Главная', redirectTo: '/admin/records', /*component: HomeComponent,*/pathMatch: 'full'},
  {
    path: 'admin', loadComponent: () => import('./pages/admin/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: '/admin/dashboard', pathMatch: 'full'},
      {path: 'dashboard', title: 'Записи', component: DashboardComponent},
      {path: 'records', title: 'Записи', component: RecordsComponent},
      {path: 'records-history', title: 'История записей', component: RecordsHistoryComponent},
      {path: 'customers', title: 'Клиенты', component: CustomersComponent},
      {path: 'employees', title: 'Сотрудники', component: EmployeeComponent},
      {path: 'services', title: 'Услуги', component: ServicesComponent},
      {path: 'services/category', title: 'Категории услуг', component: ServiceCategoryComponent},
      {path: 'chairs', title: 'Кресла', component: ChairsComponent},
      {path: 'employee-salary', title: 'Зарплата сотрудников', component: EmployeeSalaryComponent},
      {path: 'total-income', title: 'Общий доход', component: TotalIncomeComponent},
    ]
  },
  {
    path: 'admin/login',
    title: 'Логин',
    loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent)
  },
  {path: '**', title: 'Not Found', canActivate: [authGuard], component: NotFoundComponent},
];
