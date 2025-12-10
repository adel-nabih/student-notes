import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:5000/auth'; // Your backend URL

  // The official state! These signals are the source of truth.
  isLoggedIn = signal<boolean>(!!this.getToken());
  isAdmin = signal<boolean>(false); // 1. ADDED: isAdmin signal

  constructor(private http: HttpClient, private router: Router) {
    // 2. ADDED: Check admin status when the service first loads
    this.checkAdminStatus();
  }

  // 3. ADDED: New private method to check localStorage
  private checkAdminStatus() {
    // Check if a user object is in local storage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Set admin status based on the stored user's role
        this.isAdmin.set(user?.role === 'admin');
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        this.isAdmin.set(false);
      }
    } else {
      this.isAdmin.set(false);
    }
  }

  signup(data: any) {
    return this.http.post(`${this.API_URL}/signup`, data);
  }

  login(data: any) {
    return this.http.post(`${this.API_URL}/login`, data).pipe(
      tap((res: any) => {
        // 4. MODIFIED: Save token AND user object
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user)); // Save full user object

        // 5. MODIFIED: Set both signals
        this.isLoggedIn.set(true);
        this.isAdmin.set(res.user?.role === 'admin'); // Check role from response
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    // 6. MODIFIED: Clear all auth state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn.set(false);
    this.isAdmin.set(false); // Clear admin status on logout
    
    // Navigate to login after logout
    this.router.navigate(['/login']);
  }
}