import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { LoginService } from '../services/login-service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService, private http: HttpClient) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt refreshToken if available
        let currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
        if (currentUser && currentUser.jwt) {
            if(request.headers.get('isRefreshingToken') !== null) {
                request = request.clone({
                    setHeaders: { 
                        Authorization: `Bearer ${currentUser.refreshToken}`
                    }
                });
            } else {
                request = request.clone({
                    setHeaders: { 
                        Authorization: `Bearer ${currentUser.jwt}`
                    }
                });
            }
        }

        return next.handle(request);
        // .pipe(catchError(err => {
        //     if (err.includes('jwt expired')) {
        //         console.log('error in jwt inside if', err);
        //         let currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
        //         console.log('currentUser', currentUser);
        //         if (currentUser && currentUser.refreshToken) {
        //             request = request.clone({
        //                 setHeaders: { 
        //                     "isRefreshingToken": "true",
        //                      Authorization: `Bearer ${currentUser.refreshToken}`,
        //                 }
        //             }); 
                    
        //             this.http.get('http://realegovapp-env.eba-qkt6gfyy.ap-south-1.elasticbeanstalk.com/api/v1/auth/refreshToken')
        //                 .subscribe( res => {
        //                     console.log('res', res);
        //                 });
        //         }
        //     } else {

        //     } 
        //     return Observable.throw(err);
        // }));
    }
}