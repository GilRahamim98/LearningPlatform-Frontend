import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
   const token = localStorage.getItem("token");
  
      if(!token) return true;
  
      const router = inject(Router);
      router.navigateByUrl("/home");
      return false;
};
