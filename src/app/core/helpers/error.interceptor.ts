import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';

import { LoginService } from '../services/login-service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err:HttpErrorResponse) => {
            if (err.status === 401) {
                console.log('err message in error', err.error.message)
                // auto logout if 401 response returned from api
                if(err.error.message.includes('revoked')) {
                    
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('userProfile');
                    this.router.navigate(['/login']);
                    
                }
                let currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
                console.log('currentUser', currentUser);
                if (currentUser && currentUser.refreshToken) {
                    this.loginService.getRefreshToken().subscribe( res => {
                        console.log('response in 401', res);
                    }, error => {
                        console.log('error in refreshToken', error);
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('userProfile');
                        this.router.navigate(['/login']);
                    });
                    return next.handle(request).pipe(retry(1));
                } else {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('userProfile');
                    this.router.navigate(['/login']);
                }              
            } else {
                console.log('err', err.error);
                if(err && err.error){
                    let errorMessage = '';
                    if (err.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${err.error.message}`;
                    } else {
                    // server-side error
                    errorMessage = `Error Code: ${err.status}-${err.statusText}\nMessage: ${err.error.message}`;
                    }
                    return throwError(err);
                }
            }
        }))
    }
}