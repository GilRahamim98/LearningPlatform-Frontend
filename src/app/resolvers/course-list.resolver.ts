import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CourseService } from '../services/course.service';
import { CourseModel } from '../models/course.model';

// Resolves course list data before navigating to the course list page
export const courseListResolver: ResolveFn<CourseModel[]> = (route, state) => {
    const courseService = inject(CourseService);
    return courseService.getAllCourses();
};
