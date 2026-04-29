import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  
  async onLogout() {
    try {
      await this.authService.logout(); // Panggil fungsi di service
      this.router.navigate(['/auth/login']); // Pindah ke halaman login
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}
