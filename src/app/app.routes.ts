import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-area/course-list/course-list.component';
import { HomeComponent } from './components/page-area/home/home.component';
import { authGuard } from './guards/auth.guard';
import { Page404Component } from './components/page-area/page-404/page-404.component';
import { guestGuard } from './guards/guest.guard';
import { instructorGuard } from './guards/instructor.guard';
import { courseListResolver } from './resolvers/course-list.resolver';
import { courseResolver } from './resolvers/course.resolver';
import { enrollmentListResolver } from './resolvers/enrollment-list.resolver';
import { userCoursesResolver } from './resolvers/user-courses.resolver';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "profile",
        loadComponent: () => import("./components/user-area/profile/profile.component").then(m => m.ProfileComponent),
        canActivate: [authGuard],
        resolve: {
            userEnrollments: enrollmentListResolver,
            userCourses: userCoursesResolver
        }
    },
    {
        path: "courses",
        component: CourseListComponent,
        resolve: { allCourses: courseListResolver }
    },
    {
        path: "courses/new",
        loadComponent: () => import("./components/course-area/course-form/course-form.component").then(m => m.CourseFormComponent),
        canActivate: [instructorGuard]
    },
    {
        path: "courses/edit/:id",
        loadComponent: () => import("./components/course-area/course-form/course-form.component").then(m => m.CourseFormComponent),
        canActivate: [instructorGuard]
    },
    {
        path: "courses/:id",
        loadComponent: () => import("./components/course-area/course-details/course-details.component").then(m => m.CourseDetailsComponent),
        resolve: { courseDetails: courseResolver }
    },
    {
        path: "register",
        loadComponent: () => import("./components/user-area/register/register.component").then(m => m.RegisterComponent),
        canActivate: [guestGuard]
    },
    {
        path: "login",
        loadComponent: () => import("./components/user-area/login/login.component").then(m => m.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: "**",
        component: Page404Component
    }
];
