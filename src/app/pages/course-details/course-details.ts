import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Note, NoteService } from '../../services/note.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CourseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private noteService = inject(NoteService);

  notes = signal<Note[]>([]);
  isLoading = signal(true);
  courseId = '';

  // This must match your backend URL
  private BACKEND_URL = 'http://localhost:5000/';

  ngOnInit() {
    // Get the ID from the URL (e.g. /courses/654a...)
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id') || '';
      if (this.courseId) {
        this.loadNotes();
      }
    });
  }

  loadNotes() {
    this.noteService.getNotesByCourse(this.courseId).subscribe({
      next: (data) => {
        this.notes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading notes:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Helper to create the full link: http://localhost:5000/uploads/file.pdf
  getFileUrl(relativePath: string) {
    return `${this.BACKEND_URL}${relativePath}`;
  }
}