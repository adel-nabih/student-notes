import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal, inject } from '@angular/core'; // 1. Added 'inject'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Complaint, ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-complaint-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaint-form-modal.component.html',
  styleUrls: ['./complaint-form-modal.component.css']
})
export class ComplaintFormModalComponent implements OnChanges {
  // --- Inputs / Outputs ---
  @Input() complaint: Complaint | null = null; // Data for editing
  @Input() isOpen = false; // Controls visibility
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Complaint | null>(); // Allow emitting null on 'add'

  // --- Component State ---
  subject = '';
  message = '';
  modalTitle = 'Add New Complaint';
  
  errorMsg = signal('');
  isSubmitting = signal(false);

  private complaintService = inject(ComplaintService);
  private authService = inject(AuthService); // For "Add New"

  // This detects when the @Input() 'complaint' changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['complaint'] && this.complaint) {
      // Edit Mode: Pre-fill the form
      this.modalTitle = 'Edit Complaint';
      this.subject = this.complaint.subject;
      this.message = this.complaint.message;
    } else if (!this.complaint) {
      // Add Mode: Reset the form
      this.modalTitle = 'Add New Complaint';
      this.subject = '';
      this.message = '';
    }
  }

  handleSave() {
    if (!this.subject || !this.message) {
      this.errorMsg.set('Subject and message are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');

    if (this.complaint) {
      // --- EDIT MODE ---
      this.complaintService.editComplaint(this.complaint._id, { 
        subject: this.subject, 
        message: this.message 
      }).subscribe({
        // 2. Explicitly type 'updatedComplaint' as Complaint
        next: (updatedComplaint: Complaint) => this.handleSuccess(updatedComplaint),
        // 3. Explicitly type 'err' as any
        error: (err: any) => this.handleError(err)
      });
    } else {
      // --- ADD MODE ---
      this.complaintService.submitComplaint({ 
        subject: this.subject, 
        message: this.message 
      }).subscribe({
        next: () => this.handleSuccess(null), 
        // 3. Explicitly type 'err' as any
        error: (err: any) => this.handleError(err)
      });
    }
  }

  handleSuccess(data: Complaint | null) {
    this.isSubmitting.set(false);
    this.save.emit(data); // Emit the event to the parent
    this.handleClose(); // Close the modal
  }

  // 3. Explicitly type 'err' as any
  handleError(err: any) {
    this.isSubmitting.set(false);
    this.errorMsg.set(err?.error?.msg || 'Operation failed. Please try again.');
  }

  handleClose() {
    this.close.emit();
  }
}