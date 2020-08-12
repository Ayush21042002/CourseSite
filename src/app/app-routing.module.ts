import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampListComponent } from './components/camps/camp-list/camp-list.component';
import { CampCreateComponent } from './components/camps/camp-create/camp-create.component';
import { AdminLoginComponent } from './components/admin-area/admin-auth/admin-login/admin-login.component';
import { AdminSignupComponent } from './components/admin-area/admin-auth/admin-signup/admin-signup.component';
import { AuthAdminGuard } from './components/admin-area/admin-auth/auth-admin-guard';


const routes: Routes = [
  { path: '', component: CampListComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/signup', component: AdminSignupComponent, canActivate: [AuthAdminGuard] },
  { path: 'edit/:id', component: CampCreateComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/course/create', component: CampCreateComponent, canActivate: [AuthAdminGuard]},
  { path: 'contribute', component: CampCreateComponent,},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthAdminGuard],
})
export class AppRoutingModule { }
