import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-admin-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-notes.component.html',
  styleUrls: ['../admin-users/admin-users.component.css'] // Reuse Admin CSS
})
export class AdminNotesComponent implements OnInit {
  private noteService = inject(NoteService);
  private BACKEND_URL = 'http://localhost:5000/';

  notes = signal<any[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
  this.isLoading.set(true);
  this.noteService.getAllNotes().subscribe({
    // FIX: Add ': any' or ': Note[]' here
    next: (data: any) => { 
      this.notes.set(data);
      this.isLoading.set(false);
    },
    error: () => {
      this.errorMsg.set('Failed to load notes.');
      this.isLoading.set(false);
    }
  });
}

  deleteNote(id: string) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => {
          this.notes.update(curr => curr.filter(n => n._id !== id));
        },
        error: () => alert('Failed to delete note.')
      });
    }
  }

  getFileUrl(relativePath: string) {
    return `${this.BACKEND_URL}${relativePath}`;
  }
}