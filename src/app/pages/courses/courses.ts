import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course, CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css'],
})
export class CoursesComponent implements OnInit {
  private courseService = inject(CourseService);

  // Signal for the list of courses
  courses = signal<Course[]>([]);
  isLoading = signal(true);

  majors = ['Computing', 'Business', 'Media'];
  selectedMajor = signal('Computing');

  ngOnInit() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.isLoading.set(false);
      }
    });
  }

  get filteredCourses() {
    // FIX: Access .name property since major is now an object
    return this.courses().filter(course => course.major.name === this.selectedMajor());
  }

  selectMajor(major: string) {
    this.selectedMajor.set(major);
  }
}