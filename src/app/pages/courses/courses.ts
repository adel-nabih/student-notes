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
    { id: 5, name: 'Data Structures', description: 'Learn about arrays, lists, and trees', major: 'Computing' },
    { id: 6, name: 'Web Development', description: 'Building A full working website!', major: 'Computing' },
    { id: 7, name: 'Business Law', description: 'Covers legal rules for businesses, contracts, and regulations.', major: 'Business' },
    { id: 8, name: 'Business English', description: 'Learn how to speak and write in professional English', major: 'Business' },
    { id: 9, name: 'Photograpghy 101', description: 'Learn basics of photography', major: 'Media' },
    { id: 10, name: 'Advertising & Marketing Media', description: 'Creating ads and marketing campaigns.', major: 'Media' },
    { id: 11, name: 'Intro to Python', description: 'learn Python basics!', major: 'Computing' },
    { id: 12, name: 'Business English', description: 'Learn how to speak and write in professional English', major: 'Computing' },
    { id: 13, name: 'Database and mysql', description: 'Basic database and mysql skills', major: 'Computing' },






  ];

  get filteredCourses() {
    return this.courses.filter(course => course.major === this.selectedMajor);
  }

  selectMajor(major: string) {
    this.selectedMajor = major;
  }
}