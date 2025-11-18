import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

// Define an interface for what a Complaint object looks like
export interface Complaint {
  _id: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved';
  submittedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private API_URL = 'http://localhost:5000/api/complaints';

  // Helper to get headers with the auth token
  private getAuthHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- USER FUNCTION ---

  /** (User) Submits a new complaint */
  submitComplaint(data: { subject: string, message: string }) {
    return this.http.post(`${this.API_URL}`, data, { 
      headers: this.getAuthHeaders() 
    });
  }

  // --- ADMIN FUNCTIONS ---

  /** (Admin) Gets all complaints */
  getAllComplaints() {
    return this.http.get<Complaint[]>(`${this.API_URL}/admin`, { 
      headers: this.getAuthHeaders() 
    });
  }

  /** (Admin) Updates a complaint's status */
  updateComplaintStatus(id: string, status: 'pending' | 'resolved') {
    return this.http.put<Complaint>(`${this.API_URL}/admin/${id}`, { status }, { 
      headers: this.getAuthHeaders() 
    });
  }

  /** (Admin) Deletes a complaint */
  deleteComplaint(id: string) {
    return this.http.delete(`${this.API_URL}/admin/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }
  // --- ADD THIS NEW FUNCTION ---
  /** (Admin) Edits a complaint's text */
  editComplaint(id: string, data: { subject: string, message: string }) {
    return this.http.put<Complaint>(`${this.API_URL}/admin/edit/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }
}