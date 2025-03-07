import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-area/course-list/course-list.component';
import { HomeComponent } from './components/page-area/home/home.component';

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "courses", component: CourseListComponent },
    { path: "register", loadComponent: () => import("./components/user-area/register/register.component").then(m => m.RegisterComponent) },
    { path: "login", loadComponent: () => import("./components/user-area/login/login.component").then(m => m.LoginComponent) },

];
