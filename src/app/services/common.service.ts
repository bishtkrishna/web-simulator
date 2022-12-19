import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../environments/environment';

const baseUrl = environment.config.mmBackUrl;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  selectedDetails: any;
  brandList: any;

  retainExecutionData: any;
  retainMediaData: any;

  view_simulation_id:any = "";

  getCountries(): Observable<any> {
    return this.http.get(baseUrl + '/get_countries');
  }

  getCategories(data:any): Observable<any> {
    return this.http.post(baseUrl + '/get_categories',data);
  }

  getChannels(data:any): Observable<any> {
    return this.http.post(baseUrl + '/get_channels', data);
  }

  getBrands(data:any): Observable<any> {
    return this.http.post(baseUrl + '/get_brands', data);
  }

  createSimuation(data:any): Observable<any> {
    console.log(data);
    return this.http.post(baseUrl + '/create_simulation', data);
  }

  setSelectedDetails(details:any){
    this.selectedDetails = details;
  }

  setBrandList(brands:any){
    this.brandList = brands;
  }

  setExecutionData(data:any){
    this.retainExecutionData = data;
    console.log(this.retainExecutionData)
  }

  setMediaData(data:any){
    this.retainMediaData = data;
  }

  getScenarios(data:any): Observable<any> {
    return this.http.post(baseUrl + '/get_scenario', data);
  }

  getSimulations(): Observable<any> {
    return this.http.get(baseUrl + '/get_simulations');
  }

  viewSimulationById(data:any): Observable<any> {
    return this.http.post(baseUrl + '/get_simulation_by_id', data);
  }

  duplicate(data:any): Observable<any> {
    return this.http.post(baseUrl + '/duplicate', data);
  }

  archive(data:any): Observable<any> {
    return this.http.post(baseUrl + '/archive', data);
  }

  getUsers(): Observable<any> {
    return this.http.get(baseUrl + '/get_users');
  }



}
