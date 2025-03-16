import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Guard to restrict access to guest routes.
export const guestGuard: CanActivateFn = (route, state) => {
   const token = localStorage.getItem("token");
  
      if(!token) return true;
  
      const router = inject(Router);
      router.navigateByUrl("/home");
      return false;
};
