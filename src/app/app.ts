import { Component, signal } from '@angular/core';
import { RouterOutlet, provideRouter, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { CoursesComponent } from './pages/courses/courses';
import { CourseDetailsComponent } from './pages/course-details/course-details';
import { UploadNotesComponent } from './pages/upload-notes/upload-notes';
import { ContactComponent } from './pages/contact/contact';
import { bootstrapApplication } from '@angular/platform-browser';
import { NavbarComponent } from './components/navbar/navbar';
import { provideHttpClient } from '@angular/common/http';


const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: 'upload', component: UploadNotesComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('student-notes-website');
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
