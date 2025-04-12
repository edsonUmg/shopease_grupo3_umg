import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = 'http://localhost:5000/order';

  constructor(private http: HttpClient) { }

  getOrder(): Observable<any> {
    return this.http.get<any>(this.orderUrl);
  }
}
