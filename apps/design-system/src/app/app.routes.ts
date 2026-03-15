import { Routes } from '@angular/router';

import { ButtonDemoComponent, TableDemoComponent } from '@lxt/angular-components-demo';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'table',
    pathMatch: 'full',
  },
  {
    path: 'button',
    component: ButtonDemoComponent,
  },
  {
    path: 'table',
    component: TableDemoComponent,
  },
];
