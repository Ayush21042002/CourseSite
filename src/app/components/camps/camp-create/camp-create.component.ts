import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, Validators, FormGroup, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import {Course} from '../../../models/course.model';
import { AuthAdminService } from 'src/app/services/auth-admin.service';

@Component({
  selector: 'app-camp-create',
  templateUrl: './camp-create.component.html',
  styleUrls: ['./camp-create.component.css']
})
export class CampCreateComponent implements OnInit,OnDestroy {

  private mode = 'create';
  private courseId: string = null;
  private course: Course;
  isAuthenticated: boolean = false;
  imagePreview: string;
  authServiceSub: Subscription;
  dataLoaded: boolean = false;
  courseForm: FormGroup = this._formBuilder.group({
    title: [null, Validators.required],
    image: [null, [Validators.required], [mimeType]],
    description: [null, Validators.required],
    rating: [null, Validators.required],
    field: [null,],
    url: [null,],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _courseService: CourseService,
    private _activeRoute: ActivatedRoute,
    private _authService: AuthAdminService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this._authService.checkIfAdminAuthenticated();
    this.authServiceSub = this._authService.getAuthStatusListener().subscribe(authstatus => {
      this.isAuthenticated = this._authService.checkIfAdminAuthenticated();
      this.dataLoaded = false;
    })
    this._activeRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        //edit form
        this.mode = 'edit';
        this.courseId = paramMap.get('id');

        this._courseService.getCourse(this.courseId).subscribe(courseData => {

          this.course = {
            id: courseData._id,
            title: courseData.title,
            description: courseData.description,
            imagePath: courseData.imagePath,
            rating: courseData.rating,
            field: courseData.field,
            url: courseData.url,
          };

          this.dataLoaded = true;
          this.populateForm();
        }, err => { });
      } else {

        this.mode = "create";
        this.dataLoaded = true;
      }

    });
  }

  populateForm() {

    this.courseForm = this._formBuilder.group({
      title: [this.course.title, Validators.required],
      image: [this.course.imagePath, [Validators.required], [mimeType]],
      description: [this.course.description, Validators.required],
      rating: [this.course.rating, Validators.required],
      field: [this.course.field,],
      url: [this.course.url,],
    });
  }



  onFormSubmit() {
    if (this.mode === "edit") {
      if (this.courseForm.valid) this._courseService.updateCourse(this.courseId, this.courseForm.value);

    } else {
      if (this.courseForm.valid) this._courseService.addCourse(this.courseForm.value);

      this.courseForm.reset();
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.courseForm.patchValue({ image: file });
    this.courseForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authServiceSub.unsubscribe();
  }
}
