import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(){
    try{
      if(this.loginForm.valid && !this.isLoading){
        this.isLoading = true;

        await this.authService.login(
          this.loginForm.value.email,
          this.loginForm.value.password
        )
        this.isLoading = false;
        this.router.navigate(['/pokemon/List']);
      }
    }catch (error){
      this.isLoading = false;
      console.error(error);
    }
  }
}
