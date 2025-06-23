import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'chat',
    loadComponent: () => import('../pages/chat/chat.component').then(m => m.ChatComponent),
  }
];
