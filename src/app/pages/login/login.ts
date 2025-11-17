import { Component, signal } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.errorMsg.set(''); // Clear previous errors

    this.auth.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          // Success!
          // The 'tap' in the service already set the token.
          // We can optionally save the user object if the backend sends it.
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
          // Navigate to the home page
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          // Error
          this.errorMsg.set(err?.error?.msg || 'Login failed');
        }
      });
  }
}