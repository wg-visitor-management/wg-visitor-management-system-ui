import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AUTH_CONSTANTS } from '../shared/constants/auth-constants';
import { AuthService } from './service/auth.service';
import { LoginResponse } from '../shared/models/login-response-model';
import { User, UserModel } from '../shared/models/user-model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  authConstants = AUTH_CONSTANTS;
  hide: boolean = true;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    const username: string = form.value.username;
    const password: string = form.value.password;
    console.log('Form submitted', form.value);

    this.authService.login(username, password).subscribe({

      next: (response: LoginResponse) => {
        const user: User = this.authService.setUserModel(response.data.IdToken);
        this.authService.currentUser$.next(user);
        sessionStorage.setItem('user', JSON.stringify(user));
        
        if(user.role === 'admin') {
          this.router.navigate(['dashboard/admin']);
        }
        else{
          this.router.navigate(['/dashboard/user']);
        }
      },
      error: (error) => {
        console.log('Error', error);
      },
    });
  }

  showHidePassword(): void {
    this.hide = !this.hide;
  }
}
