import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

    private http = inject(HttpClient);
    

    public async getAllCourses():Promise<CourseModel[]>{
        const courses$ = this.http.get<CourseModel[]>(environment.coursesUrl); 
        const courses = await firstValueFrom(courses$);
        return courses;
    }

}
