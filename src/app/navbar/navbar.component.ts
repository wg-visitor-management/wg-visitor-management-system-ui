import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
      }
    });
  }

  logout() {
    this.authService.currentUser$.next(null);
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
