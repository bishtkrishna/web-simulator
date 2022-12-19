import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const baseUrl = environment.config.mmBackUrl
const baseUrlUser = environment.config.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class ExecutionService {

  constructor(private http: HttpClient) { }

  getPackDetailsByChannel(data:any): Observable<any> {
    return this.http.post(baseUrl + '/pack_details_by_channel', data);
  }

  getMediaDetails(data:any): Observable<any> {
    return this.http.post(baseUrl + '/media_details_by_type', data);
  }

  login(data:any): Observable<any> {
    return this.http.post(baseUrlUser +'/login',data,{withCredentials:true
    });
  }

  register(data:any): Observable<any> {
    return this.http.post(baseUrlUser + '/register',data);
  }

  userdata(): Observable<any> {
    return this.http.get(baseUrlUser +'/user',{withCredentials:true});
  }

  logout():void{
    this.http.post(baseUrlUser + '/logout',{},{withCredentials:true});
   }

}
