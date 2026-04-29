import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user={
    email: '',
    password: ''
  }

  async onSubmit(){
    try{
      await this.authService.register(this.user.email, this.user.password);
      this.router.navigate(['/auth/login']);
    }catch(error){
      console.error(error);
    }
  }
}
