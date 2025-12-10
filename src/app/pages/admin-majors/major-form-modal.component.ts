import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Major, MajorService } from '../../services/major.service';

@Component({
  selector: 'app-major-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './major-form-modal.component.html',
  styleUrls: ['./major-form-modal.component.css']
})
export class MajorFormModalComponent implements OnChanges {
  @Input() major: Major | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Major | null>();

  name = '';
  modalTitle = 'Add New Major';
  errorMsg = signal('');
  isSubmitting = signal(false);

  private majorService = inject(MajorService);

  ngOnChanges(changes: SimpleChanges): void {
    if (this.major) {
      this.modalTitle = 'Edit Major';
      this.name = this.major.name;
    } else {
      this.modalTitle = 'Add New Major';
      this.name = '';
    }
  }

  handleSave() {
    if (!this.name) {
      this.errorMsg.set('Major Name is required.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');

    if (this.major) {
      // Edit
      this.majorService.updateMajor(this.major._id, this.name).subscribe({
        next: (updated) => this.handleSuccess(updated),
        error: (err: any) => this.handleError(err)
      });
    } else {
      // Add
      this.majorService.createMajor(this.name).subscribe({
        next: () => this.handleSuccess(null),
        error: (err: any) => this.handleError(err)
      });
    }
  }

  handleSuccess(data: Major | null) {
    this.isSubmitting.set(false);
    this.save.emit(data);
    this.handleClose();
  }

  handleError(err: any) {
    this.isSubmitting.set(false);
    this.errorMsg.set(err?.error?.msg || 'Operation failed.');
  }

  handleClose() {
    this.close.emit();
  }
}