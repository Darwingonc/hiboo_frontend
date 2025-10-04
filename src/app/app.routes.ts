import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dedication',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.routes')
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/error',
    pathMatch: 'full'
  }
];
