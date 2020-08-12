import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, Validators, FormGroup, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { CampService } from 'src/app/services/camp.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import {Camp} from '../../../models/camp.model';
import { AuthAdminService } from 'src/app/services/auth-admin.service';

@Component({
  selector: 'app-camp-create',
  templateUrl: './camp-create.component.html',
  styleUrls: ['./camp-create.component.css']
})
export class CampCreateComponent implements OnInit,OnDestroy {

  private mode = 'create';
  private campId: string = null;
  private camp: Camp;
  isAuthenticated: boolean = false;
  imagePreview: string;
  authServiceSub: Subscription;
  dataLoaded: boolean = false;
  campForm: FormGroup = this._formBuilder.group({
    title: [null, Validators.required],
    image: [null, [Validators.required], [mimeType]],
    description: [null, Validators.required],
    rating: [null, Validators.required],
    field: [null,],
    url: [null,],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _campService: CampService,
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
        this.campId = paramMap.get('id');

        this._campService.getCamp(this.campId).subscribe(campData => {

          this.camp = {
            id: campData._id,
            title: campData.title,
            description: campData.description,
            imagePath: campData.imagePath,
            rating: campData.rating,
            field: campData.field,
            url: campData.url,
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

    this.campForm = this._formBuilder.group({
      title: [this.camp.title, Validators.required],
      image: [this.camp.imagePath, [Validators.required], [mimeType]],
      description: [this.camp.description, Validators.required],
      rating: [this.camp.rating, Validators.required],
      field: [this.camp.field,],
      url: [this.camp.url,],
    });
  }



  onFormSubmit() {
    if (this.mode === "edit") {
      if (this.campForm.valid) this._campService.updateCamp(this.campId, this.campForm.value);

    } else {
      if (this.campForm.valid) this._campService.addCamp(this.campForm.value);

      this.campForm.reset();
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.campForm.patchValue({ image: file });
    this.campForm.get('image').updateValueAndValidity();
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
