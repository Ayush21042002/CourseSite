import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Course } from '../models/course.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const Backend_url = "http://localhost:3000" + '/api/courses/';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  message: string = "";
  private courses: Course[] = [];
  private coursesUpdated = new Subject<{ courses: Course[], courseCount: number }>();
  constructor(private _httpClient: HttpClient, private _router: Router) { }

  getCourses(coursePerPage: number, currPageNum: number) {
    console.log(this.message);
    const querParams = `?size=${coursePerPage}&page=${currPageNum}`;
    this._httpClient
      .get<{ message: string, courses: any, maxCourses: number }>(Backend_url + querParams)
      .pipe(
        map((data) => {
          return {
            _course: data.courses.map((course) => {
              return {
                title: course.title,
                description: course.description,
                id: course._id,
                imagePath: course.imagePath,
                rating: course.rating,
                field: course.field,
                url: course.url,
              };
            }),
            maxCourses: data.maxCourses
          };
        })
      )
      .subscribe((transaformedData) => {
        this.courses = transaformedData._course;
        this.coursesUpdated.next({ courses: [...this.courses], courseCount: transaformedData.maxCourses });
      }, err => {
        this.courses = [];
        this.coursesUpdated.next({ courses: [...this.courses], courseCount: null });
      });
  }

  getCourseUpdateListener() {
    return this.coursesUpdated.asObservable();
  }

  addCourse(newCourse) {
    const courseData = new FormData();
    courseData.append('title', newCourse.title);
    courseData.append('description', newCourse.description);
    courseData.append('image', newCourse.image,newCourse.title);
    courseData.append('field', newCourse.field);
    courseData.append('rating', newCourse.rating);
    courseData.append('url',newCourse.url);

    this._httpClient
      .post<{ message: string; course: Course }>(
        Backend_url,
        courseData
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

  updateCourse(course_id: string, courseForm) {
    let courseData: Course | FormData;
    if (typeof courseForm.image == 'object') {
      courseData = new FormData();
      courseData.append('id', course_id);
      courseData.append('title', courseForm.title);
      courseData.append('description', courseForm.description);
      courseData.append('image', courseForm.image, courseForm.title);
      courseData.append('rating', courseForm.seats);
      courseData.append('field', courseForm.field);
      courseData.append('url',courseForm.url);
    } else {
      courseData = {
        id: course_id,
        title: courseForm.title,
        description: courseForm.description,
        imagePath: courseForm.image,
        rating: courseForm.rating,
        field: courseForm.field,
        url: courseForm.url,
      };
    }
    this._httpClient
      .put<{ message: string; course: Course }>(
        `${Backend_url}/${course_id}`,
        courseData
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

  deleteCourse(courseId: string) {
    return this._httpClient
      .delete(`${Backend_url}/${courseId}`)
    // .subscribe(() => {
    //   const updatedPost = this.posts.filter((post) => post.id !== postId);
    //   this.posts = updatedPost;
    //   this.postsUpdated.next([...this.posts]);
    // });
  }

  getCourse(id: string) {
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
