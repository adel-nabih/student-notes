import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { CoursesComponent } from './pages/courses/courses';
import { CourseDetailsComponent } from './pages/course-details/course-details';
import { UploadNotesComponent } from './pages/upload-notes/upload-notes';
import { ContactComponent } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: 'upload', component: UploadNotesComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' } // fallback
];
