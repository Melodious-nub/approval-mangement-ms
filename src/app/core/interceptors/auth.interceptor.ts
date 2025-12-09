import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

/**
 * HTTP Interceptor for adding Authorization token to API requests
 * TODO: Replace with real API integration
 * This interceptor automatically adds the Bearer token to all HTTP requests
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const storageService = inject(StorageService);
  const token = storageService.getToken();

  // Clone the request and add the authorization header if token exists
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // If no token, proceed with the original request
  return next(req);
};

