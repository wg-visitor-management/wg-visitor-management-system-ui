import { Injectable } from "@angular/core";

import { ToastService } from "./toast.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/service/auth.service";

export interface Error {
  error: {
    error: {
      message: string;
      code: number;
    };
    status: string;
  };
}
export interface Error2 {
  error: {
    message: string;
    code: number;
  };
  status: string;
}

@Injectable({
  providedIn: "root"
})
export class ResponseHandlerService {
  constructor(private toast: ToastService, private router: Router, private authService: AuthService) {}

  handleError(error: any) {
    let errorMessage = "An unknown error occurred!";
    try {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.error.message) {
        errorMessage = error.error.error.message;
      }
      errorMessage = this.errorMapper(errorMessage);
    } catch (error) {
      errorMessage = "An unknown error occurred!";
    }
    this.toast.showError(errorMessage);
    return error;
  }

  errorMapper(message: string): string {
    if (message.includes("expired")) {
      this.authService.logout();
      return "Session expired, please login again!";
    }
    return message;
  }
}
