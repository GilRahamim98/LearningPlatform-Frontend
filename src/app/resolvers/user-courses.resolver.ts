import { ResolveFn } from '@angular/router';
import { CourseModel } from '../models/course.model';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { UserStore } from '../storage/user-store';

// Resolves user courses before navigating to the profile page
export const userCoursesResolver: ResolveFn<CourseModel[]> = (route, state) => {
    const userService = inject(UserService);
    const userStore = inject(UserStore);

    return userStore.RoleName() === "Student" ? userService.getStudentCourses(userStore.user()?.id) : [];
};
