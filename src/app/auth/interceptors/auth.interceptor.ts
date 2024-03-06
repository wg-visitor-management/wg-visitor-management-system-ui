import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";

import { Observable, catchError, throwError } from "rxjs";

import { ResponseHandlerService } from "src/app/shared/services/error-handler.service";
import { LoaderService } from "src/app/shared/services/loader.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private responseHandler: ResponseHandlerService,
    private loader: LoaderService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!sessionStorage.getItem("user")) {
      return next.handle(request).pipe(
        catchError((error) => {
          this.responseHandler.handleError(error);
          const err = new Error(error);
          return throwError(() => err);
        })
      );
    }
    const userDetails = JSON.parse(sessionStorage.getItem("user") ?? "");

    const token = userDetails["jwt_token"];
    const headers = request.headers.set("Authorization", `Bearer ${token}`);
    const modifiedRequest = request.clone({ headers });

    return next.handle(modifiedRequest).pipe(
      catchError((error) => {
        this.responseHandler.handleError(error);
        const err = new Error(error);
        this.loader.hideLoader();
        return throwError(() => err);
      })
    );
  }
}
