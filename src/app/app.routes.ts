import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { CoursesComponent } from './pages/courses/courses';
import { CourseDetailsComponent } from './pages/course-details/course-details';
import { UploadNotesComponent } from './pages/upload-notes/upload-notes';
import { ContactComponent } from './pages/contact/contact';

// 1. IMPORT THE NEW FILES
import { AdminComplaintsComponent } from './pages/admin-complaints/admin-complaints';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: 'upload', component: UploadNotesComponent },
  { path: 'contact', component: ContactComponent }, // This route is correct

  // 2. ADD THE NEW ADMIN ROUTE
  { 
    path: 'admin/complaints', 
    component: AdminComplaintsComponent,
    canActivate: [adminGuard] // This protects the route
  },

  { path: '**', redirectTo: '' } // fallback
];