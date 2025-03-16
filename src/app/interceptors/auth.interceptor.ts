import { HttpInterceptorFn } from '@angular/common/http';

// HTTP interceptor to attach the JWT token to outgoing HTTP requests
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem("token");
    
    const clonedRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
    
    return next(clonedRequest);
};
