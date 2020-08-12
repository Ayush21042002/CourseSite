import { Component,OnInit, OnDestroy } from '@angular/core';
import { AuthAdminService } from '../../services/auth-admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private authListenerSubs: Subscription;
  public userAuthenticated: boolean = false;
  public adminAuthenticated: boolean = false;
  constructor(
    private _authAdminService: AuthAdminService,
    ) { }


  ngOnInit(): void {
    this.adminAuthenticated = this._authAdminService.checkIfAdminAuthenticated();
    this.authListenerSubs = this._authAdminService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.adminAuthenticated = isAuthenticated;
    })
  }
  onAdminLogout() {
    this._authAdminService.logout();
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}
