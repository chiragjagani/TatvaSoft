import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AdminloginService } from '../service/adminlogin.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public service: AdminloginService,
    private route: Router,
    private toastr: NgToastService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const myToken = this.service.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` },
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 401:
              this.toastr.error({
                detail: 'ERROR',
                summary: 'Token is Expired, Please Login Again',
                duration: 3000,
              });
              this.service.LoggedOut();
              this.route.navigate(['/admin']);
              break;
            case 403:
              this.toastr.error({
                detail: 'ERROR',
                summary: 'You do not have permission to perform this action.',
                duration: 3000,
              });
              break;
            case 400:
              console.error('Validation errors:', err.error.errors); // Log validation errors
              this.toastr.error({
                detail: 'ERROR',
                summary: 'Bad Request: ' + err.error.title,
                duration: 3000,
              });
              break;
            default:
              this.toastr.error({
                detail: 'ERROR',
                summary: `An error occurred: ${err.message}`,
                duration: 3000,
              });
              break;
          }
        } else {
          this.toastr.error({
            detail: 'ERROR',
            summary: 'An unknown error occurred.',
            duration: 3000,
          });
        }

        console.error('Error from interceptor:', err); // Log the error for debugging

        // Return the error message or a default error message
        return throwError(
          () => new Error(err.message || 'Some other error occurred')
        );
      })
    );
  }
}
