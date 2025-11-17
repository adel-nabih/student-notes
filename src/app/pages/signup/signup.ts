import { Component, signal } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  name = '';
  email = '';
  universityId = '';
  password = '';
  confirmPassword = '';
  errorMsg = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.errorMsg.set(''); // Clear previous errors

    if (this.password !== this.confirmPassword) {
      this.errorMsg.set("Passwords don't match");
      return;
    }

    this.auth.signup({
      name: this.name,
      email: this.email,
      universityId: this.universityId,
      password: this.password
    }).subscribe({
      next: () => {
        // Success!
        // Redirect to login page so they can sign in
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        // Error
        this.errorMsg.set(err?.error?.msg || 'Sign up failed');
      }
    });
  }
}