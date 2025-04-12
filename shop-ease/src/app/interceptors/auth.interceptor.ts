import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip non-API requests
    if (!request.url.includes(environment.apiUrl)) {
      return next.handle(request);
    }

    // Skip auth routes
    if (environment.tokenBlacklistedRoutes.some(route => request.url.includes(route))) {
      return next.handle(request);
    }

    // Add auth token
    const token = this.authService.getToken();
    const authReq = token 
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/user-management/login']);
        }
        return throwError(error);
      })
    );
  }
}