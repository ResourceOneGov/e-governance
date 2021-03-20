import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginService } from '../services/login-service';
import { UserService } from '../services/user-service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUserProfile = JSON.parse(window.localStorage.getItem('userProfile'));
        if (currentUserProfile && currentUserProfile.role && currentUserProfile.role.roleLevel 
                && currentUserProfile.role.roleLevel === 5) {
            // authorised so return true
            return true;
        }

        this.router.navigate(['/layouts/dashboard']);
        // this.router.navigate(['/layouts/reports']);
        return false;
        
    }
}