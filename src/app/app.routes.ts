import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {ClientsComponent} from './pages/admin/clients/clients.component';
import {LoginComponent} from './pages/admin/login/login.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';

export const routes: Routes = [
  {path: '', title: 'Главная', component: HomeComponent, pathMatch: 'full'},
  {
    path: 'admin', loadComponent: () => import('./pages/admin/admin/admin.component').then(m => m.AdminComponent), children: [
      {path: '', redirectTo: '/admin/clients', pathMatch: 'full'},
      {path: 'clients', title: 'Клиенты', component: ClientsComponent},
    ]
  },
  {path: 'admin/login', title: 'Логин', loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent)},
  {path: '**', title: 'Not Found', component: NotFoundComponent},
];
