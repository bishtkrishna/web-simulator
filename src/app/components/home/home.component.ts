import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showDiv = {
    Mfilter: false,
    current: false,
    tvFilter: false,
    MediaFilter: false,
  };
  // growthAchieved:any;
  growthAmbition:any;
  selectedBrand:any;
  input_values_by_brand:any;
  tv_genres:any;
  digital_platforms:any;
  total_volume:any;
  hidemenuIcon:boolean = false;
  showMenuItem = false;
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
   this.navDataSubscription(); 
  }
  navDataSubscription(){
    this.dataService.simulationMenuData$.subscribe(simdata =>{
      if(simdata.length > 0){
        this.showMenuItem = true;
        this.growthAmbition = simdata[0].growthAmbition;
        this.selectedBrand = simdata[0].selectedBrand;
        this.digital_platforms = simdata[0].digital_platforms;
        this.input_values_by_brand = simdata[0].input_values_by_brand;
        this.tv_genres = simdata[0].tv_genres;
        this.total_volume = simdata[0].total_volume;
      } else {
        this.showMenuItem = false;
      }
    })
  }
}
