import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const baseUrl = environment.config.apiUrl;
@Injectable({
  providedIn: 'root'
})

export class UserService {
  loggedin:boolean = false;
  constructor(
    private http: HttpClient
  ) {
    
  }

  login(data:any): Observable<any> {
    return this.http.post(baseUrl +'/login',data,{withCredentials:true
    });
  }

  register(data:any): Observable<any> {
    return this.http.post(baseUrl + '/register',data);
  }

  userdata(): Observable<any> {
    return this.http.get(baseUrl +'/user',{withCredentials:true});
  }

  logout():void{
    this.http.post(baseUrl + '/logout',{},{withCredentials:true});
   }
}
