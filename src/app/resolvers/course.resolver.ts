import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { CourseModel } from '../models/course.model';

// Resolves course data before navigating to the course detail page
export const courseResolver: ResolveFn<CourseModel|void> = (route, state) => {
    const courseService = inject(CourseService);
    const router = inject(Router);
    const id = route.paramMap.get("id");
    if(!id){
        router.navigateByUrl('/not-found');
    }
    return courseService.getCourseById(id).catch(()=>{
        router.navigateByUrl('/not-found');
    });
};
