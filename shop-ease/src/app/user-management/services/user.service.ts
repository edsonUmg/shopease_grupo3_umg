import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ApiResponse } from '@app/models/user.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users`);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/${id}`);
  }

  createUser(userData: Omit<User, 'id'>): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${environment.apiUrl}/users`,
      userData
    );
  }

  updateUser(id: number, userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(
      `${environment.apiUrl}/users/${id}`,
      userData
    );
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/users/${id}`);
  }
}