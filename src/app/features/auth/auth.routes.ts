import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

export const AUTH_ROUTES: Routes = [
  { path: '', component: Login },
  { path: 'forgot-password', component: ForgotPasswordComponent }
];
