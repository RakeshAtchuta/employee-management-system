import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  http = inject(HttpClient);

  base = 'http://127.0.0.1:8000/api';


  headers() {
    return new HttpHeaders({
      'Authorization':
        'Bearer ' +
        (localStorage.getItem('access') || '')
    });
  }


  get<T>(url: string): Observable<T> {

    return this.http.get<T>(
      this.base + url,
      {
        headers: this.headers()
      }
    );

  }


  post<T>(
    url: string,
    data: any
  ): Observable<T> {

    // Login request should NOT send
    // an old/expired JWT token.
    if (url === '/auth/login/') {

      return this.http.post<T>(
        this.base + url,
        data
      );

    }


    return this.http.post<T>(
      this.base + url,
      data,
      {
        headers: this.headers()
      }
    );

  }


  put<T>(
    url: string,
    data: any
  ): Observable<T> {

    return this.http.put<T>(
      this.base + url,
      data,
      {
        headers: this.headers()
      }
    );

  }


  delete<T>(
    url: string
  ): Observable<T> {

    return this.http.delete<T>(
      this.base + url,
      {
        headers: this.headers()
      }
    );

  }

}