import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthAdminService } from 'src/app/services/auth-admin.service';



@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  isLoading: boolean = false;
  constructor(
    private _router: Router,
    private _authService: AuthAdminService
  ) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return false;
    }
    this.isLoading = true;
    console.log(form.value)
    this._authService.authenticateAdmin(form);
    setTimeout(() => { this._router.navigateByUrl('/') }, 1000)

  }
}


