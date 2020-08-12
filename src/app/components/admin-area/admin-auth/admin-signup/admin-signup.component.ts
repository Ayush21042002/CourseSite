import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthAdminService } from 'src/app/services/auth-admin.service';

@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent implements OnInit {

  isLoading:boolean = false;

  constructor(
    private _router: Router,
    private _authService: AuthAdminService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){
    if (form.invalid)
      return;
    this.isLoading = true;
     this._authService.createAdmin(form)
      .subscribe(result => {
        this.isLoading = false;
        this._router.navigateByUrl('/admin/login');
      }, error => {
        this.isLoading = false;
        this._router.navigateByUrl('/admin/login');
      })

    }
}
