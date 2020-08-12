import { Component, OnInit,OnDestroy } from '@angular/core';
import { Course } from '../../../models/course.model';
import { CourseService }  from '../../../services/course.service';
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

  courses: Course[] = [];
  private _subscribe: Subscription;
  isLoading: boolean = true;

  private authAdminStatusSubs: Subscription;
  adminIsAuthenticated: boolean = false;


  constructor(
    private _courseService: CourseService,
    private _authAdminService: AuthAdminService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.loggedInAdmin = this._authAdminService.getCurrentAdmin();
    this._courseService.getCourses(this.pageSize, this.currPage);
    this._subscribe = this._courseService.getCourseUpdateListener().subscribe((retreivedCourseData: { courses: Course[], courseCount: number }) => {
      //console.log(retreivedPostData)
      this.isLoading = false;
      this.length = retreivedCourseData.courseCount;
      this.courses = retreivedCourseData.courses;//not immediately updating


    })
    this.adminIsAuthenticated = this._authAdminService.checkIfAdminAuthenticated();
    this.authAdminStatusSubs = this._authAdminService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.adminIsAuthenticated = isAuthenticated;
      this.loggedInAdmin = this._authAdminService.getCurrentAdmin();
    })
  }

  onDelete(id: string) {
    this._courseService.deleteCourse(id).subscribe(() => {
      this._courseService.getCourses(this.pageSize, this.currPage);
    }, err => { });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.pageSize = pageData.pageSize;
    this.currPage = pageData.pageIndex + 1;
    this._courseService.getCourses(this.pageSize, this.currPage);

  }

  ngOnDestroy(): void {
    this._subscribe.unsubscribe();
    this.authAdminStatusSubs.unsubscribe();
  }

}
