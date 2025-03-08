import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { CourseStore } from '../storage/course-store';

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    private http = inject(HttpClient);
    private courseStore = inject(CourseStore);

    public async getAllCourses(): Promise<CourseModel[]> {
        if(this.courseStore.count() > 0) return this.courseStore.courses();
        const courses$ = this.http.get<CourseModel[]>(environment.coursesUrl);
        const courses = await firstValueFrom(courses$);
        return courses;
    }


    public async getOneCourse(id: string): Promise<CourseModel> {
        const course = this.courseStore.courses().find(c => c.id === id);
        if (course) return course;

        const course$ = this.http.get<CourseModel>(environment.coursesUrl + id);
        const dbCourse = await firstValueFrom(course$);
        return dbCourse;
    }

    public async addCourse(course: CourseModel): Promise<void> {

        const dbCourse$ = this.http.post<CourseModel>(environment.coursesUrl,course);
        const dbCourse = await firstValueFrom(dbCourse$);
        this.courseStore.addCourse(dbCourse);
    }

    public async updateProduct(course: CourseModel): Promise<void> {

        const dbCourse$ = this.http.put<CourseModel>(environment.coursesUrl + course.id, course);
        const dbCourse = await firstValueFrom(dbCourse$);
        this.courseStore.updateCourse(dbCourse);
    }

    public async deleteCourse(id: string): Promise<void> {
        const observable$ = this.http.delete(environment.coursesUrl + id);
        await firstValueFrom(observable$);
        this.courseStore.deleteCourse(id);
    }


}
