import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Camp } from '../models/camp.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const Backend_url = "http://localhost:3000" + '/api/camps/';


@Injectable({
  providedIn: 'root'
})
export class CampService {

  message: string = "";
  private camps: Camp[] = [];
  private campsUpdated = new Subject<{ camps: Camp[], campCount: number }>();
  constructor(private _httpClient: HttpClient, private _router: Router) { }

  getCamps(campPerPage: number, currPageNum: number) {
    console.log(this.message);
    const querParams = `?size=${campPerPage}&page=${currPageNum}`;
    this._httpClient
      .get<{ message: string, camps: any, maxCamps: number }>(Backend_url + querParams)
      .pipe(
        map((data) => {
          return {
            _camp: data.camps.map((camp) => {
              return {
                title: camp.title,
                description: camp.description,
                id: camp._id,
                imagePath: camp.imagePath,
                rating: camp.rating,
                field: camp.field,
                url: camp.url,
              };
            }),
            maxCamps: data.maxCamps
          };
        })
      )
      .subscribe((transaformedData) => {
        this.camps = transaformedData._camp;
        this.campsUpdated.next({ camps: [...this.camps], campCount: transaformedData.maxCamps });
      }, err => {
        this.camps = [];
        this.campsUpdated.next({ camps: [...this.camps], campCount: null });
      });
  }

  getCampUpdateListener() {
    return this.campsUpdated.asObservable();
  }

  addCamp(newCamp) {
    const campData = new FormData();
    campData.append('title', newCamp.title);
    campData.append('description', newCamp.description);
    campData.append('image', newCamp.image,newCamp.title);
    campData.append('field', newCamp.field);
    campData.append('rating', newCamp.rating);
    campData.append('url',newCamp.url);

    this._httpClient
      .post<{ message: string; camp: Camp }>(
        Backend_url,
        campData
      )
      .subscribe((data) => {
        this._router.navigateByUrl('/');
        //after we fetch the new data per page . this is not required
        // const new_post: Post = {
        //   id: data.post.id,
        //   title: data.post.title,
        //   content: data.post.content,
        //   imagePath: data.post.imagePath,
        // };
        // this.posts.push(new_post);
        // this.postsUpdated.next([...this.posts]);
      }, err => { });
  }

  updateCamp(camp_id: string, campForm) {
    let campData: Camp | FormData;
    if (typeof campForm.image == 'object') {
      campData = new FormData();
      campData.append('id', camp_id);
      campData.append('title', campForm.title);
      campData.append('description', campForm.description);
      campData.append('image', campForm.image, campForm.title);
      campData.append('rating', campForm.seats);
      campData.append('field', campForm.field);
      campData.append('url',campForm.url);
    } else {
      campData = {
        id: camp_id,
        title: campForm.title,
        description: campForm.description,
        imagePath: campForm.image,
        rating: campForm.rating,
        field: campForm.field,
        url: campForm.url,
      };
    }
    this._httpClient
      .put<{ message: string; camp: Camp }>(
        `${Backend_url}/${camp_id}`,
        campData
      )
      .subscribe((response) => {
        this._router.navigateByUrl('/');
        //after we fetch the new data per page . this is not required
        // //locally update the posts array.
        // const updatedPosts = [...this.posts];
        // const oldpostIndex = updatedPosts.findIndex((p) => p.id === post_id);
        // const post = {
        //   id: post_id,
        //   title: postForm.title,
        //   content: postForm.content,
        //   imagePath: response.post.imagePath,
        // };
        // updatedPosts[oldpostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
      }, err => { });
  }

  deleteCamp(campId: string) {
    return this._httpClient
      .delete(`${Backend_url}/${campId}`)
    // .subscribe(() => {
    //   const updatedPost = this.posts.filter((post) => post.id !== postId);
    //   this.posts = updatedPost;
    //   this.postsUpdated.next([...this.posts]);
    // });
  }

  getCamp(id: string) {
    return this._httpClient.get<{
      _id: string;
      title: string;
      description: string;
      imagePath: string;
      field: string;
      rating: Number;
      url: string;
    }>(`${Backend_url}/${id}`);
  }

}
