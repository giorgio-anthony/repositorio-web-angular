import { Routes } from '@angular/router';
import { RepositoriosComponent } from './pages/repositorios/repos.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/repositorios/repos.component').then(m => m.RepositoriosComponent),
  }
];