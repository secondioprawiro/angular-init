import { Injectable, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private ngZone: NgZone) {}

  private isSessionStorageAvailable(): boolean {
    try{
      return typeof window !== 'undefined' && 'sessionStorage' in window;
    }catch(error){
      console.error(error);
      return false;
    }
  }

  async register(email:string, passowrd:string){
    try{
      const user = await this.ngZone.runOutsideAngular(() => createUserWithEmailAndPassword(
        this.auth, email, passowrd));

        const userData = {
          email: user.user.email,
          uId: user.user.uid,
          registeredAt: new Date().toISOString()
        }

        if(this.isSessionStorageAvailable()){
          sessionStorage.setItem('user', JSON.stringify(userData));

          this.ngZone.run(() => {
            console.log('User registered successfully:', userData);
          })
        }
    }catch(error){
      console.error(error);
      this.ngZone.run(() => {
        console.log('Error during registration:', error);
      })

      throw error;
    }
  }

  async login(email:string, password:string){
    try{
      const user = await this.ngZone.runOutsideAngular(() => 
      signInWithEmailAndPassword(this.auth, email, password));

      const userData = {
        email: user.user.email,
        uId: user.user.uid
      }

      if(this.isSessionStorageAvailable()){
          sessionStorage.setItem('user', JSON.stringify(userData));

          this.ngZone.run(() => {
            console.log('User login successfully:', userData);
          })
        }        
    }catch(error){
      this.ngZone.run(() => {
          alert("Gagal login"+ error);
        })

      throw error;
    }
  }

  getUser(){
    if(!this.isSessionStorageAvailable()){
      return null;
    }
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async logout(){
    try{
      if(this.isSessionStorageAvailable()){
        sessionStorage.removeItem('user');
      }

      await this.ngZone.runOutsideAngular(() => signOut(this.auth));

      this.ngZone.run(() => {
        console.log('User logged out successfully');
      })
    }catch(error){
      this.ngZone.run(() => {
        alert("Gagal logout" + error);
      })

      throw error;
    }
  }
}
