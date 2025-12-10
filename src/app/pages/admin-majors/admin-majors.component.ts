import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Major, MajorService } from '../../services/major.service';
import { MajorFormModalComponent } from './major-form-modal.component';

@Component({
  selector: 'app-admin-majors',
  standalone: true,
  imports: [CommonModule, MajorFormModalComponent],
  templateUrl: './admin-majors.component.html',
  styleUrls: ['./admin-majors.component.css']
})
export class AdminMajorsComponent implements OnInit {
  private majorService = inject(MajorService);

  majors = signal<Major[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');

  isModalOpen = signal(false);
  currentMajor = signal<Major | null>(null);

  ngOnInit() {
    this.loadMajors();
  }

  loadMajors() {
    this.isLoading.set(true);
    this.majorService.getAllMajors().subscribe({
      next: (data) => {
        this.majors.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load majors.');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.currentMajor.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(major: Major) {
    this.currentMajor.set(major);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  handleSave(updated: Major | null) {
    if (updated) {
      // Update the specific major in the list without reloading
      this.majors.update(curr => curr.map(m => m._id === updated._id ? updated : m));
    } else {
      // Reload list for new items
      this.loadMajors();
    }
  }

  deleteMajor(id: string) {
    if (confirm('Delete this major? Warning: This might break courses linked to it!')) {
      this.majorService.deleteMajor(id).subscribe({
        next: () => {
          this.majors.update(curr => curr.filter(m => m._id !== id));
        },
        error: () => alert('Failed to delete major.')
      });
    }
  }
}