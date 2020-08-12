//feature provided by angulat http client

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthAdminService } from 'src/app/services/auth-admin.service';

@Injectable()
export class AuthAdminInterceptor implements HttpInterceptor {
  constructor(private _AuthService: AuthAdminService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this._AuthService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next.handle(authRequest);
  }
  //after this register this interception in app.module.ts ,in provider array,
  //and set multi=true, so that it doesnot override the already present interceptors.
}
