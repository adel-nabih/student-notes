import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface User {
  _id: string;
  name: string;
  email: string;
  universityId: string;
  role: 'user' | 'admin';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private API_URL = 'http://localhost:5000/api/users';

  private getAuthHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.auth.getToken()}` });
  }

  // GET All Users
  getAllUsers() {
    return this.http.get<User[]>(this.API_URL, { headers: this.getAuthHeaders() });
  }

  // UPDATE Role (Promote/Demote)
  updateUserRole(id: string, role: 'user' | 'admin') {
    return this.http.put<User>(`${this.API_URL}/${id}/role`, { role }, { headers: this.getAuthHeaders() });
  }

  // DELETE User
  deleteUser(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.getAuthHeaders() });
  }
}