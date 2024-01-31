import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

import { BehaviorSubject } from 'rxjs';
import { AUTH_SERVICE_CONSTANTS  } from '../../shared/constants/auth-service-constants';
import { LoginResponse } from 'src/app/shared/models/login-response-model';
import { User, UserModel } from 'src/app/shared/models/user-model';
import { JwtDecodedData } from 'src/app/shared/models/jwt_decoded_model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = AUTH_SERVICE_CONSTANTS.baseUrl;

  currentUser$ = new BehaviorSubject<User | null>(null);
  constructor(private http:HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, {
      username,
      password,
    });
  }

  setUserModel(jwt_token: string) {
    let decoded : JwtDecodedData = jwtDecode(jwt_token);
    let role : string = decoded['cognito:groups'][0];
    let user: User = new UserModel(jwt_token, decoded.sub, role, decoded['name'], decoded['email'], decoded.exp);
    return user;
  }




}

