import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { BehaviorSubject, Observable } from "rxjs";
import { jwtDecode } from "jwt-decode";

import {
  ForgotPasswordResponse,
  LoginResponse
} from "src/app/shared/models/login-response-model";
import { User, UserModel } from "src/app/shared/models/user-model";
import { JwtDecodedData } from "src/app/shared/models/jwt_decoded_model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  baseUrl = environment.apiUrl;
  tokenExpirationTimer!: ReturnType<typeof setTimeout>;
  currentUser$ = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, {
      username,
      password
    });
  }

  sendOtp(action: string, alias: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.baseUrl}/forgot_password`,
      { action, alias }
    );
  }

  resetPassword(
    action: string,
    alias: string,
    code: string,
    password: string
  ): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.baseUrl}/forgot_password`,
      { action, alias, code, password }
    );
  }

  setUserModel(jwt_token: string): User {
    const decoded: JwtDecodedData = jwtDecode(jwt_token);
    const role: string = decoded["cognito:groups"][0];
    const user: User = new UserModel(
      jwt_token,
      decoded.sub,
      role,
      decoded["name"],
      decoded["email"],
      decoded.exp
    );
    return user;
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout(): void {
    this.currentUser$.next(null);
    sessionStorage.clear();
    this.router.navigate(["/login"]);
  }

  autoLogin() {
    const loadedUser = this.loadUserFromSession();
    if (loadedUser?.jwt_token) {
      const expirationTime =
        new Date(loadedUser.exp).getTime() * 1000 - new Date().getTime();
      if (loadedUser.role === "admin") {
        this.router.navigate(["dashboard/admin"]);
      } else {
        this.router.navigate(["/dashboard/user"]);
      }
      this.autoLogout(expirationTime);
    }
  }

  loadUserFromSession(): User | null {
    const data = sessionStorage.getItem("user");
    if (!data) {
      return null;
    }
    const userData = JSON.parse(data);

    const loadedUser = new UserModel(
      userData.jwt_token,
      userData.username,
      userData.role,
      userData.name,
      userData.email,
      userData.exp
    );
    this.currentUser$.next(loadedUser);
    return loadedUser;
  }
}
