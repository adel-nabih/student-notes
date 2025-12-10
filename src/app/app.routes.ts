import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { CoursesComponent } from './pages/courses/courses';
import { CourseDetailsComponent } from './pages/course-details/course-details';
import { UploadNotesComponent } from './pages/upload-notes/upload-notes';
import { ContactComponent } from './pages/contact/contact';

import { AdminComplaintsComponent } from './pages/admin-complaints/admin-complaints';
import { AdminMajorsComponent } from './pages/admin-majors/admin-majors.component';
import { AdminCoursesComponent } from './pages/admin-courses/admin-courses.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminNotesComponent } from './pages/admin-notes/admin-notes.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: 'upload', component: UploadNotesComponent },
  { path: 'contact', component: ContactComponent },

  // --- Admin Routes ---
  { 
    path: 'admin/complaints', 
    component: AdminComplaintsComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'admin/majors', 
    component: AdminMajorsComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'admin/courses', 
    component: AdminCoursesComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'admin/users', 
    component: AdminUsersComponent,
    canActivate: [adminGuard]
  },

  { 
  path: 'admin/notes', 
  component: AdminNotesComponent,
  canActivate: [adminGuard]
  },
  // --------------------

  { path: '**', redirectTo: '' } // fallback
];