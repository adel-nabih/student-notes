import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  // Use inject() to get the service instance here
  private auth = inject(AuthService); 
  
  // Read the signals from the service
  isLoggedIn = this.auth.isLoggedIn;
  isAdmin = this.auth.isAdmin; // <-- 1. ADDED: Read the new admin signal

  // The constructor is not needed for injection
  // constructor() {}

  // Call the service's logout method
  logout() {
    this.auth.logout();
  }
}