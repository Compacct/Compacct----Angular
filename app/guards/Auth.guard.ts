import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private cookie: CookieService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.isLoggedIn()) {
            return true;
        }
        // navigate to login page as user is not authenticated
        this.router.navigate(['/merberLogin']);
        return false;
    }
    public isLoggedIn(): boolean {
        let status = false;
        //if (localStorage.getItem('isLoggedIn') === 'true') {
        //   status = true;
        //} else {
        //   status = false;
        //   }
        //return status;
        //}
        if (this.cookie.get('_Compacct_Cookie')) {
            status = true;
        } else {
            status = false;
        }
        return status;

    }
}
