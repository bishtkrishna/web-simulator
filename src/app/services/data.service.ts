import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonService } from './common.service';

const baseUrl = environment.config.mmBackUrl;;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private simulation_status = new Subject<string>();
  public simulation_status$ = this.simulation_status.asObservable();

  constructor(private http: HttpClient,
    private commonService:CommonService) { }

  simulationParameters: any
  recommendedValues: any;
  newRecommendedValues:any;

  private trigInputName = new Subject<string>();
  public trigInputName$ = this.trigInputName.asObservable();

  private SimulationMenuData = new Subject<any>();
  public simulationMenuData$ = this.SimulationMenuData.asObservable();

  getCSVData(data:any): Observable<any> {
    return this.http.post(baseUrl + '/fetch_csv_data', data);  
  }

  runSimulator(data:any): Observable<any> {
    return this.http.post(baseUrl + '/run_simulator', data);
  }

  setRecommendedValues(details:any){
    this.recommendedValues = details;
  }

  setSimulationParameters(parameters:any){
    this.simulationParameters = parameters;
  }

  saveScenario(data:any): Observable<any> {
    return this.http.post(baseUrl + '/save_scenario', data);
  }

  saveConstraintsToDB(data:any): Observable<any> {
    return this.http.post(baseUrl + '/save_constraints', data);
  }

  setNewValues(details:any){
    this.newRecommendedValues = details;
  }

  updateSimualtionStatus(): Observable<any>{
    // if simulation id exists
    if(this.commonService.view_simulation_id){
      this.commonService.viewSimulationById({'id':this.commonService.view_simulation_id})
      .subscribe(
        data => {
          // console.log(data);
          this.simulation_status.next(data['simulation_detail'][0]);
        },
        error => {
          console.log(error);
          
      });         
    }
    return this.simulation_status;
  }

  tryScenario(data:any): Observable<any> {
    return this.http.post(baseUrl + '/try_scenario', data);
  }

  compareScenarios(data:any): Observable<any> {
    return this.http.post(baseUrl + '/compare_scenarios', data);
  }

  uploadData(data:any):Observable<any> {
    return this.http.post(baseUrl + '/upload_data', data);
  }

  getUploads():Observable<any> {
    return this.http.get(baseUrl + '/get_uploads');
  }

  getArchiveUploads():Observable<any> {
    return this.http.get(baseUrl + '/get_archived_uploads');
  }

  uploadArchieves(data:any):Observable<any> {
    return this.http.post(baseUrl + '/archive_uploads', data);
  }

  trigInputname(name:string){
    this.trigInputName.next(name);
  }

  compelteScenario(data:any):Observable<any> {
    return this.http.post(baseUrl + '/complete_scenario', data);
  }

  downloadScenarios(data:any):Observable<any> {
    return this.http.post(baseUrl + '/download_scenario', data, { responseType: 'blob'});
  }
  
  downloadadminExcel(data:any):Observable<any> {
    return this.http.post<any>(baseUrl + '/download_excel', data, {responseType: 'blob' as 'json'});
  }

  menuSimulationData(data:any){
    this.SimulationMenuData.next(data);
  }
}

