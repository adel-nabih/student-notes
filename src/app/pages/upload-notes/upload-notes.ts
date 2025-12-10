import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Course, CourseService } from '../../services/course.service';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-upload-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-notes.html',
  styleUrls: ['./upload-notes.css']
})
export class UploadNotesComponent implements OnInit {
  private courseService = inject(CourseService);
  private noteService = inject(NoteService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // State Signals
  courses = signal<Course[]>([]);
  majors = ['Computing', 'Business', 'Media'];
  
  // Form Signals
  selectedMajor = signal('Computing');
  selectedCourseId = signal('');
  noteTitle = signal('');
  selectedFile: File | null = null;
  
  // UI State
  isSubmitting = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  isLoggedIn = this.authService.isLoggedIn;

  ngOnInit() {
    // Load courses so we can populate the dropdown
    this.courseService.getCourses().subscribe({
      next: (data) => this.courses.set(data),
      error: (err) => console.error(err)
    });
  }

  // Filter courses based on selected major
  get filteredCourses() {
    // FIX: Access .name property since major is now an object
    return this.courses().filter(c => c.major.name === this.selectedMajor());
  }

  // Handle dropdown change
  onMajorChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedMajor.set(select.value);
    this.selectedCourseId.set(''); // Reset course selection
  }

  // Handle file selection input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit() {
    if (!this.selectedCourseId() || !this.noteTitle() || !this.selectedFile) {
      this.errorMsg.set('Please fill in all fields and select a file.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');

    // --- CRITICAL: Build FormData ---
    const formData = new FormData();
    formData.append('title', this.noteTitle());
    formData.append('course', this.selectedCourseId());
    formData.append('file', this.selectedFile);

    this.noteService.uploadNote(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMsg.set('Note uploaded successfully!');
        
        // Reset form
        this.noteTitle.set('');
        this.selectedFile = null;
        // Reset file input visually (optional trick, or just let page refresh)
        setTimeout(() => {
          this.successMsg.set('');
          this.router.navigate(['/courses']); // Redirect back to courses
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err?.error?.msg || 'Upload failed.');
      }
    });
  }
}