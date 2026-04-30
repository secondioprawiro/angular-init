import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { selectCartCount } from '../../store/cart.selectors';
import { openCart } from '../../store/cart.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  // Observable jumlah item cart — ditampilkan sebagai badge di ikon cart
  cartCount$: Observable<number> = this.store.select(selectCartCount);

  openCart() {
    // dispatch openCart action → reducer set isOpen: true → CartComponent tampil
    this.store.dispatch(openCart());
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}
