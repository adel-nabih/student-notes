import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  subject = '';
  message = '';

  // Signals for handling form state
  errorMsg = signal('');
  successMsg = signal('');
  isSubmitting = signal(false);

  // Check if user is logged in
  authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;

  private complaintService = inject(ComplaintService);

  submitComplaint() {
    if (!this.subject || !this.message) {
      this.errorMsg.set('Subject and message are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.complaintService.submitComplaint({ 
      subject: this.subject, 
      message: this.message 
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMsg.set('Your complaint has been submitted successfully!');
        // Clear the form
        this.subject = '';
        this.message = '';
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err?.error?.msg || 'Submission failed. Please try again.');
      }
    });
  }
}