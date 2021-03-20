import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login, ChangePassword } from '../models/login.model';
import { map } from 'rxjs/operators';

const baseUrl = environment.baseUrl;
const loginUrl = baseUrl + '/auth/login';
const changePasswordUrl = baseUrl + '/auth/changePassword';
const createUserUrl = baseUrl + '/auth/user';
const getOTPUrl = baseUrl + '/auth/otp';
const refreshTokenUrl = baseUrl + '/auth/refreshToken';
const verifyOTPUrl = baseUrl + '/auth/verifyOtp';
const forgotPasswordUrl = baseUrl + '/auth/forgotPassword';
const resetPasswordUrl = baseUrl + '/auth/resetPassword';
const logOutUrl = baseUrl + '/auth/logout';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) { 
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    onLogin(loginDetails: Login) {
        return this.http.post<any>(`${loginUrl}`, loginDetails)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    changePassword(changePasswordParams) {
       return this.http.post<ChangePassword>(changePasswordUrl, changePasswordParams); 
    }

    logout() {
        // remove user from local storage and set current user to null
        return this.http.post(logOutUrl, {})
        .pipe(map(user => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userProfile');
            this.currentUserSubject.next(null);
        }));    
    }

    onLoginViaOTP(mobileNumber) {
        return this.http.get<any>(`${getOTPUrl}`, { params: new HttpParams().set('mobileNumber', mobileNumber.mobileNumber)} );
    }

    onForgotPassword(eMail) {
        return this.http.post<any>(`${forgotPasswordUrl}`, eMail);
    }

    onResetPassword(resetParams){
        return this.http.post<any>(resetPasswordUrl,resetParams);
    }

    onVerifyOTP(verifyOTP) {
        return this.http.post<any>(verifyOTPUrl, verifyOTP)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    getRefreshToken() {
        const refreshtoken = JSON.parse(localStorage.getItem('currentUser')).refreshToken;
        console.log('refresh Token', refreshtoken);
        // let headers: HttpHeaders = new HttpHeaders();
        // headers = headers.append('isRefreshingtoken', "true");

        return this.http.get<any>(`${refreshTokenUrl}`, { 
            headers: new HttpHeaders().set('isRefreshingtoken','true') 
        }).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

}