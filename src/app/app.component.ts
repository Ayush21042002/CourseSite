import { Component,OnInit } from '@angular/core';
import { AuthAdminService } from './services/auth-admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private _authService: AuthAdminService) {}
  ngOnInit(): void {
    this._authService.autoAuthAdmin();
  }
}
