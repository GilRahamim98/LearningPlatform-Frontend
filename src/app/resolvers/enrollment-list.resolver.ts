import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { EnrollmentModel } from '../models/enrollment.model';
import { UserStore } from '../storage/user-store';

// Resolves user enrollments before navigating to the profile page
export const enrollmentListResolver: ResolveFn<EnrollmentModel[]> = (route, state) => {
    const userService = inject(UserService);
    const userStore = inject(UserStore);        
    return userStore.RoleName() === "Student" ? userService.getStudentEnrollments(userStore.user()?.id) : [];
};
