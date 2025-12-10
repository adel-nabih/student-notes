import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course, CourseService } from '../../services/course.service';
import { Major, MajorService } from '../../services/major.service';

@Component({
  selector: 'app-course-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-form-modal.component.html',
  styleUrls: ['../admin-majors/major-form-modal.component.css'] // Reuse existing CSS
})
export class CourseFormModalComponent implements OnChanges, OnInit {
  @Input() course: Course | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Course | null>();

  // Form Fields
  name = '';
  code = '';
  majorId = ''; // This will hold the selected ID from the dropdown

  // Data for Dropdown
  majors = signal<Major[]>([]);

  modalTitle = 'Add New Course';
  errorMsg = signal('');
  isSubmitting = signal(false);

  private courseService = inject(CourseService);
  private majorService = inject(MajorService);

  ngOnInit() {
    // Load majors immediately so the dropdown is ready
    this.majorService.getAllMajors().subscribe({
      next: (data) => this.majors.set(data),
      error: () => this.errorMsg.set('Failed to load majors list.')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.course) {
      this.modalTitle = 'Edit Course';
      this.name = this.course.name;
      this.code = this.course.code;
      this.majorId = this.course.major._id; // Pre-select the dropdown
    } else {
      this.modalTitle = 'Add New Course';
      this.name = '';
      this.code = '';
      this.majorId = '';
    }
  }

  handleSave() {
    if (!this.name || !this.code || !this.majorId) {
      this.errorMsg.set('All fields are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');

    const courseData = {
      name: this.name,
      code: this.code,
      major: this.majorId
    };

    if (this.course) {
      // Edit
      this.courseService.updateCourse(this.course._id, courseData).subscribe({
        next: (updated) => this.handleSuccess(updated),
        error: (err: any) => this.handleError(err)
      });
    } else {
      // Add
      this.courseService.createCourse(courseData).subscribe({
        next: (created) => this.handleSuccess(created), // created is the full object
        error: (err: any) => this.handleError(err)
      });
    }
  }

  handleSuccess(data: Course | null) {
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