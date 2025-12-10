import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CourseService } from '../../services/course.service';
import { CourseFormModalComponent } from './course-form-modal.component';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, CourseFormModalComponent],
  templateUrl: './admin-courses.component.html',
  styleUrls: ['../admin-majors/admin-majors.component.css'] // Reuse CSS!
})
export class AdminCoursesComponent implements OnInit {
  private courseService = inject(CourseService);

  courses = signal<Course[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');

  isModalOpen = signal(false);
  currentCourse = signal<Course | null>(null);

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading.set(true);
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load courses.');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.currentCourse.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(course: Course) {
    this.currentCourse.set(course);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  handleSave(updated: Course | null) {
    if (updated) {
      // If editing, update the specific item in the list
      this.courses.update(curr => curr.map(c => c._id === updated._id ? updated : c));
      // If adding (updated is new obj), append it
      if (!this.courses().find(c => c._id === updated._id)) {
         this.courses.update(curr => [...curr, updated]);
      }
    } else {
      this.loadCourses();
    }
  }

  deleteCourse(id: string) {
    if (confirm('Delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses.update(curr => curr.filter(c => c._id !== id));
        },
        error: () => alert('Failed to delete course.')
      });
    }
  }
}