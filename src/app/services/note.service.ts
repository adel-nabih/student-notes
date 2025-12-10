import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

// Update interface to match the populated data from backend
export interface Note {
  _id: string;
  title: string;
  fileUrl: string;
  course: {
    _id: string;
    name: string;
    code: string;
  };
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private API_URL = 'http://localhost:5000/api/notes';

  // Helper to get auth headers
  private getAuthHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- USER FUNCTIONS ---

  uploadNote(formData: FormData) {
    return this.http.post(
      `${this.API_URL}/upload`, 
      formData, 
      { headers: this.getAuthHeaders() }
    );
  }

  getNotesByCourse(courseId: string) {
    return this.http.get<Note[]>(`${this.API_URL}/${courseId}`);
  }

  // --- ADMIN FUNCTIONS (These were missing!) ---

  getAllNotes() {
    // Calls the new admin route we made in the backend
    return this.http.get<Note[]>(`${this.API_URL}/admin/all`, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteNote(id: string) {
    return this.http.delete(`${this.API_URL}/admin/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }
}