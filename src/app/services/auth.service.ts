import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:5000/auth'; // Your backend URL

  // The official state! This signal is the source of truth.
  isLoggedIn = signal<boolean>(!!this.getToken());

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: any) {
    return this.http.post(`${this.API_URL}/signup`, data);
  }

  login(data: any) {
    return this.http.post(`${this.API_URL}/login`, data).pipe(
      tap((res: any) => {
        // On successful login, save token and update the signal
        localStorage.setItem('token', res.token);
        this.isLoggedIn.set(true);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    // On logout, clear token/user and update the signal
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn.set(false);
    // Navigate to login after logout
    this.router.navigate(['/login']);
  }
}