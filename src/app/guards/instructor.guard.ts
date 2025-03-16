import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

// Guard to restrict access to instructor user routes.
export const instructorGuard: CanActivateFn = (route, state) => {
    const token = localStorage.getItem("token");
    const router = inject(Router);
    if(!token){
        router.navigateByUrl("/home");
        return false;
    }
    const payload = jwtDecode<{ user: string }>(token);
    const dbUser = JSON.parse(payload.user);
    if (dbUser.role !== "Instructor"){
        router.navigateByUrl("/home");
        return false;
    }
    return true;
};
