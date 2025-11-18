import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Complaint, ComplaintService } from '../../services/complaint.service';
// 1. Import the new modal component
import { ComplaintFormModalComponent } from './complaint-form-modal.component';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  // 2. Add the modal to the imports array
  imports: [CommonModule, ComplaintFormModalComponent],
  templateUrl: './admin-complaints.html',
  styleUrls: ['./admin-complaints.css']
})
export class AdminComplaintsComponent implements OnInit {
  private complaintService = inject(ComplaintService);

  // --- Signals for page state ---
  complaints = signal<Complaint[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');

  // --- 3. Signals for Modal State ---
  isModalOpen = signal(false);
  // This holds the complaint we are currently editing
  currentComplaint = signal<Complaint | null>(null);

  ngOnInit() {
    this.loadComplaints();
  }

  loadComplaints() {
    this.isLoading.set(true);
    this.errorMsg.set('');
    
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Failed to load complaints.');
        this.isLoading.set(false);
      }
    });
  }

  // --- 4. Methods to Open/Close the Modal ---

  /** Opens the modal in "Add New" mode */
  openAddModal() {
    this.currentComplaint.set(null); // Clear any existing complaint
    this.isModalOpen.set(true);
  }

  /** Opens the modal in "Edit" mode */
  openEditModal(complaint: Complaint) {
    this.currentComplaint.set(complaint); // Set the complaint to edit
    this.isModalOpen.set(true);
  }

  /** Closes the modal */
  closeModal() {
    this.isModalOpen.set(false);
  }

  /** Handles the save event from the modal */
  handleSave(updatedComplaint: Complaint | null) {
    if (updatedComplaint) {
      // --- EDIT MODE ---
      // We received the updated complaint, just swap it in the list
      this.complaints.update(current => 
        current.map(c => c._id === updatedComplaint._id ? updatedComplaint : c)
      );
    } else {
      // --- ADD MODE ---
      // We didn't get the new complaint back, so we must reload the whole list
      this.loadComplaints();
    }
  }
  
  /** Updates a complaint's status */
  toggleStatus(complaint: Complaint) {
    const newStatus = complaint.status === 'pending' ? 'resolved' : 'pending';
    
    this.complaintService.updateComplaintStatus(complaint._id, newStatus).subscribe({
      next: (updatedComplaint) => {
        // Update the signal with the new data
        this.complaints.update(currentComplaints => 
          currentComplaints.map(c => 
            c._id === updatedComplaint._id ? updatedComplaint : c
          )
        );
      },
      error: () => {
        this.errorMsg.set('Failed to update status.');
      }
    });
  }

  /** Deletes a complaint */
  deleteComplaint(id: string) {
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: () => {
          // Remove the deleted complaint from the signal
          this.complaints.update(currentComplaints => 
            currentComplaints.filter(c => c._id !== id)
          );
        },
        error: () => {
          this.errorMsg.set('Failed to delete complaint.');
        }
      });
    }
  }
}