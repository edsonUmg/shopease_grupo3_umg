import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, User, RegisterData } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadCurrentUser();
  }

  checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
    return this.http.post<{ available: boolean }>(
      `${environment.apiUrl}/auth/check-username`,
      { username }
    ).pipe(
      catchError(error => {
        console.error('Username check error', error);
        return throwError(() => error);
      })
    );
  }

  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.http.post<{ available: boolean }>(
      `${environment.apiUrl}/auth/check-email`,
      { email }
    ).pipe(
      catchError(error => {
        console.error('Email check error', error);
        return throwError(() => error);
      })
    );
  }

  private loadCurrentUser(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        console.error('Error parsing user data', e);
        this.clearSession();
      }
    }
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    if (!credentials.username || !credentials.password) {
      return throwError(() => new Error('Username and password are required'));
    }

    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`, 
      {
        username: credentials.username.trim(),
        password: credentials.password
      }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response);
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/register`,
      userData
    ).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response);
        }
      }),
      catchError(error => {
        console.error('Registration error', error);
        return throwError(() => error);
      })
    );
  }

  private setSession(authResult: AuthResponse): void {
    try {
      localStorage.setItem('token', authResult.token);
      localStorage.setItem('currentUser', JSON.stringify(authResult.user));
      this.currentUserSubject.next(authResult.user);
    } catch (e) {
      console.error('Error saving session', e);
      this.clearSession();
    }
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/user-management/login']);
  }
  getCurrentUser(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}