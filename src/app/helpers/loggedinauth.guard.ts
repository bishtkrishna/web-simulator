import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedinauthGuard implements CanActivate {
  constructor(private _authService: UserService, private _router: Router) { }

    canActivate(): boolean {
        if (this._authService.loggedin) {
            this._router.navigate(['/scenario'])
            return false
        } else {
          // this._router.navigate(['login'])
            return true
        }
    }
  
}
