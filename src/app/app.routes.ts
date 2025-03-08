import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-area/course-list/course-list.component';
import { HomeComponent } from './components/page-area/home/home.component';
import { authGuard } from './guards/auth.guard';
import { CourseCardComponent } from './components/course-area/course-card/course-card.component';
import { CourseDetailsComponent } from './components/course-area/course-details/course-details.component';

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "courses", component: CourseListComponent },
    { path: "courses/:id", component: CourseDetailsComponent },
    { path: "register", loadComponent: () => import("./components/user-area/register/register.component").then(m => m.RegisterComponent) },
    { path: "login", loadComponent: () => import("./components/user-area/login/login.component").then(m => m.LoginComponent) },
    { path: "profile", loadComponent: () => import("./components/user-area/profile/profile.component").then(m => m.ProfileComponent) ,canActivate:[authGuard]},

];
