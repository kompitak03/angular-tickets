import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/auth/auth.guard';


const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: './page/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'contracts',
    loadChildren: './page/contacts/contacts.module#ContactsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: './page/auth/auth.module#AuthModule'
  },
  {
    path: 'profile',
    loadChildren: './page/profile/profile.module#ProfileModule'
  },
  {
    path: '**',
    redirectTo: 'user'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
