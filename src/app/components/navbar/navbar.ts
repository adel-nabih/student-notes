import { Component, inject } from '@angular/core'; // <-- 1. Import inject
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
  // 2. Use inject() to get the service instance here
  private auth = inject(AuthService); 
  
  // 3. Now this line works perfectly, as 'auth' is already defined
  isLoggedIn = this.auth.isLoggedIn;

  // 4. The constructor is no longer needed for injection
  // constructor() {}

  // Call the service's logout method
  logout() {
    this.auth.logout();
  }
}