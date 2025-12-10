import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface Course {
  _id: string;
  name: string;
  code: string;
  // Major is now an object because we populate it in the backend
  major: {
    _id: string;
    name: string;
  }; 
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private API_URL = 'http://localhost:5000/api/courses';

  private getAuthHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.auth.getToken()}` });
  }

  // GET All (Public)
  getCourses() {
    return this.http.get<Course[]>(this.API_URL);
  }

  // CREATE (Admin)
  createCourse(data: { name: string, code: string, major: string }) {
    // Note: 'major' here is the ID string from the dropdown
    return this.http.post<Course>(this.API_URL, data, { headers: this.getAuthHeaders() });
  }

  // UPDATE (Admin)
  updateCourse(id: string, data: { name: string, code: string, major: string }) {
    return this.http.put<Course>(`${this.API_URL}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  // DELETE (Admin)
  deleteCourse(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.getAuthHeaders() });
  }
}