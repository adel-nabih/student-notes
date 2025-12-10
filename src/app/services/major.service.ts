import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface Major {
  _id: string;
  name: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class MajorService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private API_URL = 'http://localhost:5000/api/majors';

  private getAuthHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.auth.getToken()}` });
  }

  getAllMajors() {
    return this.http.get<Major[]>(this.API_URL);
  }

  createMajor(name: string) {
    return this.http.post<Major>(this.API_URL, { name }, { headers: this.getAuthHeaders() });
  }

  updateMajor(id: string, name: string) {
    return this.http.put<Major>(`${this.API_URL}/${id}`, { name }, { headers: this.getAuthHeaders() });
  }

  deleteMajor(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.getAuthHeaders() });
  }
}