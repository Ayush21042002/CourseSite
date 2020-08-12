import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthAdminData } from '../components/admin-area/admin-auth/auth-admin-data';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

// import { environment } from '../../environments/environment'

const Backend_url = "http://localhost:3000" + '/api/admin/';


@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {

  private token;
  private loggedInAdmin: string;
  private isAuthenticated: boolean = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(
    private _httpClient: HttpClient, private _router: Router
  ) { }

  getToken() {
    return this.token;
  }


  checkIfAdminAuthenticated() {
    return this.isAuthenticated;
  }


  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expireDuration', expirationDate.toISOString());
    localStorage.setItem('adminId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expireDuration');
    localStorage.removeItem('adminId');
  }

  getCurrentAdmin() {
    return this.loggedInAdmin;
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expireDuration');
    const adminId = localStorage.getItem('adminId');
    if (!token || !expiration) {
      return;
    }
    return {
      token: token,
      expirationTime: new Date(expiration),
      adminId: adminId,
    }
  }

  private setAuthTimer(duration: number) {
    console.log("setting timer", duration)
    this.tokenTimer = setTimeout(() => {
      this.logout;
    }, duration * 1000);
  }

  createAdmin(form: NgForm) {
    const authData: AuthAdminData = {
      email: form.value.email,
      password: form.value.password,
    };
    return this._httpClient
      .post(Backend_url + '/signup', authData);
  }

  authenticateAdmin(form: NgForm) {
    const authData: AuthAdminData = {
      email: form.value.email,
      password: form.value.password,
    };
    this._httpClient
      .post<{ token: string, expirationTime: number, admin_id: string}>(
        Backend_url + '/login',
        authData
      )
      .subscribe((response) => {

        this.token = response.token;
        this.loggedInAdmin = response.admin_id;
        if (response) {
          const expiresIn = response.expirationTime;
          this.setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate, this.loggedInAdmin);
          console.log('value is',this.isAuthenticated)
        }

      }, err => {
        this.isAuthenticated = false;
        this.loggedInAdmin = null;
      });

    //this._router.navigateByUrl('/');
  }

  autoAuthAdmin() {
    const authInfo = this.getAuthData();
    if (authInfo == null) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationTime.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token,
        this.isAuthenticated = true;
      this.loggedInAdmin = authInfo.adminId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  //to kick off the automatic authentication , call this function in app component, because that is loaded first
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this._router.navigateByUrl('/');
    this.clearAuthData();
    this.loggedInAdmin = null;
    clearTimeout(this.tokenTimer);
  }


  // private token;
  // private loggedInAdmin: string;
  // private isAuthenticated: boolean = false;
  // private authStatusListener = new Subject<boolean>();
  // private tokenTimer: any;

  // constructor(
  //   private _httpClient: HttpClient, private _router: Router
  // ) { }

  // getToken() {
  //   return this.token;
  // }


  // checkIfAdminAuthenticated() {
  //   return this.isAuthenticated;
  // }


  // getAuthStatusListener() {
  //   return this.authStatusListener.asObservable();
  // }

  // private saveAuthData(token: string, expirationDate: Date, adminId: string) {
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('expireDuration', expirationDate.toISOString());
  //   localStorage.setItem('adminId', adminId);
  // }

  // private clearAuthData() {
  //   localStorage.removeItem('adminId');
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('expireDuration');
  // }

  // getCurrentAdmin() {
  //   return this.loggedInAdmin;
  // }

  // private getAuthData() {
  //   const token = localStorage.getItem('token');
  //   const expiration = localStorage.getItem('expireDuration');
  //   const adminId = localStorage.getItem('adminId');
  //   if (!token || !expiration) {
  //     return null;
  //   }
  //   return {
  //     token: token,
  //     expirationTime: new Date(expiration),
  //     adminId: adminId
  //   }
  // }

  // private setAuthTimer(duration: number) {
  //   console.log("setting timer", duration)
  //   this.tokenTimer = setTimeout(() => {
  //     this.logout;
  //   }, duration * 1000);
  // }



  // createAdmin(form: NgForm) {
  //   const authData: AuthAdminData = {
  //     email: form.value.email,
  //     password: form.value.password,
  //   };
  //   return this._httpClient
  //     .post(Backend_url + '/signup', authData);

  // }


  // authenticateAdmin(form: NgForm) {
  //   const authData: AuthAdminData = {
  //     email: form.value.email,
  //     password: form.value.password,
  //   };
  //   this._httpClient
  //     .post<{ token: string, expirationTime: number, admin_id: string }>(
  //       Backend_url + '/login',
  //       authData
  //     )
  //     .subscribe((response) => {

  //       this.token = response.token;
  //       this.loggedInAdmin = response.admin_id;
  //       if (response) {
  //         const expiresIn = response.expirationTime;
  //         this.setAuthTimer(expiresIn);
  //         this.isAuthenticated = true;
  //         this.authStatusListener.next(true);
  //         const now = new Date();
  //         const expirationDate = new Date(now.getTime() + expiresIn * 1000);
  //         this.saveAuthData(this.token, expirationDate, this.loggedInAdmin);
  //       }

  //     }, err => {
  //       this.isAuthenticated = false;
  //       this.loggedInAdmin = null;
  //     });

  //   //this._router.navigateByUrl('/');
  // }

  // autoAuthAdmin() {
  //   const authInfo = this.getAuthData();
  //   if (authInfo == null) {
  //     return;
  //   }
  //   const now = new Date();
  //   const expiresIn = authInfo.expirationTime.getTime() - now.getTime();
  //   if (expiresIn > 0) {
  //     this.token = authInfo.token,
  //       this.isAuthenticated = true;
  //     this.loggedInAdmin = authInfo.adminId;
  //     this.setAuthTimer(expiresIn / 1000);
  //     this.authStatusListener.next(true);
  //   }
  // }
  // //to kick off the automatic authentication , call this function in app component, because that is loaded first
  // logout() {
  //   this.token = null;
  //   this.isAuthenticated = false;
  //   this.authStatusListener.next(false);
  //   this._router.navigateByUrl('/');
  //   this.clearAuthData();
  //   this.loggedInAdmin = null;
  //   clearTimeout(this.tokenTimer);
  // }

}
