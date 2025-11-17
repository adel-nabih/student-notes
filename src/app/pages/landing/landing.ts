import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToCourses() {
    this.router.navigate(['/courses']);
  }
}