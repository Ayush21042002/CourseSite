import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CampListComponent } from './components/camps/camp-list/camp-list.component';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from '@angular/material/toolbar';
import { CampCreateComponent } from './components/camps/camp-create/camp-create.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule }  from '@angular/material/progress-spinner';
import { AdminLoginComponent } from './components/admin-area/admin-auth/admin-login/admin-login.component';
import { AdminSignupComponent } from './components/admin-area/admin-auth/admin-signup/admin-signup.component';
import { HeaderComponent } from './components/header/header.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule, HTTP_INTERCEPTORS }  from '@angular/common/http';
import { AuthAdminInterceptor } from './components/admin-area/admin-auth/auth-admin-interceptor';
import { FooterComponent } from './components/footer/footer.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    CampListComponent,
    CampCreateComponent,
    AdminLoginComponent,
    AdminSignupComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthAdminInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
