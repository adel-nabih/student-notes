import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- import CommonModule instead of NgForOf

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, CommonModule], // <-- use CommonModule
  templateUrl: './courses.html',
  styleUrls: ['./courses.css'],
})
export class CoursesComponent {
  majors = ['Computing', 'Business', 'Media'];
  selectedMajor = 'Computing';

  courses = [
    { id: 1, name: 'Computer Science 101', description: 'Intro to CS', major: 'Computing' },
    { id: 2, name: 'Business Management', description: 'Learn management basics', major: 'Business' },
    { id: 3, name: 'Digital Media Design', description: 'Learn design tools', major: 'Media' },
    { id: 4, name: 'Software Engineering', description: 'Advanced programming', major: 'Computing' },
  ];

  get filteredCourses() {
    return this.courses.filter(course => course.major === this.selectedMajor);
  }

  selectMajor(major: string) {
    this.selectedMajor = major;
  }
}
