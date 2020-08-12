import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthAdminService } from 'src/app/services/auth-admin.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  constructor(
    private _authAdminService: AuthAdminService,
   private _router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    const isAuthenticated: boolean = this._authAdminService.checkIfAdminAuthenticated();
    if (!isAuthenticated) {
      this._router.navigateByUrl('/admin/login');
    }
    console.log(isAuthenticated);
    return isAuthenticated;
  }


}

//after this register this authguard in provider array of routing module.
