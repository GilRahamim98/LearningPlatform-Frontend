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

    // Fetch all courses from the server or return cached courses if available
    public async getAllCourses(): Promise<CourseModel[]> {
        // Check if courses are already cached in the store
        if (this.courseStore.count() > 0) return this.courseStore.courses();

        // Fetch courses from the server
        const courses$ = this.http.get<CourseModel[]>(environment.coursesUrl);
        const courses = await firstValueFrom(courses$);

        // Initialize the course store with fetched courses
        this.courseStore.initCourses(courses);
        return courses;
    }

    // Fetch a course by its ID from the server or return cached course if available
    public async getCourseById(id: string): Promise<CourseModel> {
        // Check if the course is already cached in the store
        const course = this.courseStore.courses()?.find(c => c.id === id);
        if (course) return course;

        // Fetch the course from the server
        const course$ = this.http.get<CourseModel>(environment.coursesUrl + id);
        const dbCourse = await firstValueFrom(course$);
        return dbCourse;
    }

    // Add a new course to the server and update the course store
    public async addCourse(course: CourseModel): Promise<CourseModel> {
        // Send a POST request to add the course
        const dbCourse$ = this.http.post<CourseModel>(environment.coursesUrl, course);
        const dbCourse = await firstValueFrom(dbCourse$);

        // Add the new course to the course store
        this.courseStore.addCourse(dbCourse);
        return dbCourse;
    }

    // Update an existing course on the server and update the course store
    public async updateCourse(course: CourseModel): Promise<CourseModel> {
        // Send a PUT request to update the course
        const dbCourse$ = this.http.put<CourseModel>(environment.coursesUrl + course.id, course);
        const dbCourse = await firstValueFrom(dbCourse$);

        // Update the course in the course store
        this.courseStore.updateCourse(dbCourse);
        return dbCourse;
    }

    // Delete a course from the server and update the course store
    public async deleteCourse(id: string): Promise<void> {
        // Send a DELETE request to remove the course
        const observable$ = this.http.delete(environment.coursesUrl + id);
        await firstValueFrom(observable$);

        // Remove the course from the course store
        this.courseStore.deleteCourse(id);
    }


}
