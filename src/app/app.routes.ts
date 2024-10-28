import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {CustomersComponent} from './pages/admin/customers/customers.component';

export const routes: Routes = [
  {path: '', title: 'Главная', component: HomeComponent, pathMatch: 'full'},
  {
    path: 'admin', loadComponent: () => import('./pages/admin/admin/admin.component').then(m => m.AdminComponent), children: [
      {path: '', redirectTo: '/admin/customers', pathMatch: 'full'},
      {path: 'customers', title: 'Клиенты', component: CustomersComponent},
    ]
  },
  {path: 'admin/login', title: 'Логин', loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent)},
  {path: '**', title: 'Not Found', component: NotFoundComponent},
];
