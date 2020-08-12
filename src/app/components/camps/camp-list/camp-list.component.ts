import { Component, OnInit,OnDestroy } from '@angular/core';
import { Camp } from '../../../models/camp.model';
import { CampService }  from '../../../services/camp.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthAdminService } from 'src/app/services/auth-admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camp-list',
  templateUrl: './camp-list.component.html',
  styleUrls: ['./camp-list.component.css']
})
export class CampListComponent implements OnInit,OnDestroy {

  loggedInUser: string = null;
  loggedInAdmin: string = null;
  length: number = 0;
  pageSize: number = 4;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  currPage: number = 1;



  camps: Camp[] = [];
  private _subscribe: Subscription;
  isLoading: boolean = true;

  private authAdminStatusSubs: Subscription;
  userIsAuthenticated: boolean = false;
  adminIsAuthenticated: boolean = false;


  constructor(
    private _campService: CampService,
    private _authAdminService: AuthAdminService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.loggedInAdmin = this._authAdminService.getCurrentAdmin();
    this._campService.getCamps(this.pageSize, this.currPage);
    this._subscribe = this._campService.getCampUpdateListener().subscribe((retreivedCampData: { camps: Camp[], campCount: number }) => {
      //console.log(retreivedPostData)
      this.isLoading = false;
      this.length = retreivedCampData.campCount;
      this.camps = retreivedCampData.camps;//not immediately updating


    })
    this.adminIsAuthenticated = this._authAdminService.checkIfAdminAuthenticated();
    this.authAdminStatusSubs = this._authAdminService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.adminIsAuthenticated = isAuthenticated;
      this.loggedInAdmin = this._authAdminService.getCurrentAdmin();
    })
  }

  onDelete(id: string) {
    this._campService.deleteCamp(id).subscribe(() => {
      this._campService.getCamps(this.pageSize, this.currPage);
    }, err => { });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.pageSize = pageData.pageSize;
    this.currPage = pageData.pageIndex + 1;
    this._campService.getCamps(this.pageSize, this.currPage);

  }

  ngOnDestroy(): void {
    this._subscribe.unsubscribe();
    this.authAdminStatusSubs.unsubscribe();
  }

}
