import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Guard to restrict access to authenticated user routes.
export const authGuard: CanActivateFn = (route, state) => {
    const token = localStorage.getItem("token");

    if(token) return true;

    const router =inject(Router);
    router.navigateByUrl("/login");
    return false;
};
