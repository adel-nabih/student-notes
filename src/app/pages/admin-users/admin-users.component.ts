import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load users.');
        this.isLoading.set(false);
      }
    });
  }

  toggleRole(user: User) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) {
      this.userService.updateUserRole(user._id, newRole).subscribe({
        next: (updatedUser) => {
          // Update the list locally
          this.users.update(curr => curr.map(u => u._id === updatedUser._id ? updatedUser : u));
        },
        error: (err) => alert(err?.error?.msg || 'Failed to update role.')
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users.update(curr => curr.filter(u => u._id !== id));
        },
        error: () => alert('Failed to delete user.')
      });
    }
  }
}