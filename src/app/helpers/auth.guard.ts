// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
// import { ExecutionService } from '../services/execution.service';
// import { UserService } from '../services/user.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   userdata ='';
//   constructor(
//     private router: Router,
//     private user: ExecutionService
// ) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     this.user.userdata().subscribe(res=>{
//       this.userdata = res;
//       console.log(this.userdata);
//     });
//     if (this.userdata != 'Unathenticated!') {
//         // authorised so return true
//         return true;
//     }

//     else{
//       // not logged in so redirect to login page with the return url
//       this.router.navigate(['/login']);
//       return false;
//     }
// }
  
// }
