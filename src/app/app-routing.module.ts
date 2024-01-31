import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule)
  },
  {
    path: 'dashboard/admin',
    loadChildren: () =>
      import('./admin-dashboard/admin-dashboard.module').then(
        (module) => module.AdminDashboardModule
      )
  },
  {
    path: 'dashboard/user',
    loadChildren: () =>
      import('./user-dashboard/user-dashboard.module').then(
        (module) => module.UserDashboardModule
      )
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
