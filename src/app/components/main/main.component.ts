import { Component, OnInit } from '@angular/core';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  showDiv = {
    previous : true,
    current : false,
    next : false,
    media : false
  }

  brand_list:any;
  selectedDetails: any = {};
  total_volume: any = {};
  growth_ambition: any;
  growth:any;
  woa:any;
  weekly_grp:any;
  tv_grp_total:any;
  tv_genres:any = {};
  channel_trade: any = {};
  channel_trade_new: any;

  digital_platforms:any = {};
  national_da:any = {};
  tv_digital_values: any = {};
  existing_values: any = {};
  effectiveness_values: any = {};
  asp_values: any = {};
  tv_total_data: any = {};
  digital_total_data:any = {};

  selectedBrand: any;

  insert_db = [];
  constraints_value:any;

  brand_level_constraints: any = [];
  portfolio_brand: any = [];
  insert_brand = 1;
  disabled = false;
  pga: any;

  // default values 
  input_values: any= {
    'growth_ambition': 5,
    'woa':20,
    'weekly_grp': 200,
    'total_spend': 20000000,
    'total_tv_spend': 20000000,
    'max_trade':''
  };
  input_values_by_brand: any = {

  }

  isShowDiv = false;
  simulation_status: any;
  errors: any = [];
  reportingPeriod:any;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  constructor(private commonService:CommonService, 
              private dataService:DataService, 
              public dialog: MatDialog,
              private router: Router,
              private location:Location,
              private notifyService : NotificationService) { }

  ngOnInit(): void {
    this.selectedDetails = this.commonService.selectedDetails;
    this.brand_list = this.commonService.brandList;
    this.selectedBrand = this.brand_list[0];
    let growth_ambition: any[] = [];
    let total_digital_spend: any[] = [];
    let total_tv_spend: any[] = [];
    let inputs: any = {};
    this.reportingPeriod = this.selectedDetails.timeline;
    if(this.selectedDetails.growth_ambition) {
      growth_ambition = JSON.parse(this.selectedDetails.growth_ambition);
      total_digital_spend = JSON.parse(this.selectedDetails.total_digital_spend);
      total_tv_spend = JSON.parse(this.selectedDetails.total_tv_spend);
      let i = 0;
      this.brand_list.forEach((b: any)=> {
        inputs[b] = this.input_values;
        inputs[b].growth_ambition = growth_ambition[i];
        inputs[b].total_spend = total_digital_spend[i];
        inputs[b].total_tv_spend = total_tv_spend[i];
        i += 1;
      }); 
    }
    
    this.brand_list.forEach((brand: any)=> {
      if(!inputs[brand as keyof typeof inputs]) {
        inputs[brand] = {}; 
      }
      this.input_values_by_brand[brand] = JSON.parse(JSON.stringify(inputs[brand as keyof typeof inputs]));
      this.getCSVData(brand);
    });
    this.dataService.updateSimualtionStatus();
    this.dataService.simulation_status$.subscribe((data:any)=>{
      let status = data['status'];
      this.simulation_status = status;
      this.reportingPeriod = data['timeline'];
    })
    this.validate(null, null);
    
  }
  validate(brand: any, field: any): void {
    this.disabled = false;
    this.errors = [];
    let total_volume = 0;
    this.brand_list.forEach((b: any)=> {
      total_volume += this.input_values_by_brand[b]['current_volume'];
    });
    let new_volume = total_volume;
    this.brand_list.forEach((b: any)=> {
      if(!this.input_values_by_brand[b]['growth_ambition']) {
        this.disabled = true;
        this.errors.push("Please enter "+b+" growth ambition");
      }
      if(this.tv_genres[b] && this.tv_genres[b].length > 0 && !this.input_values_by_brand[b]['total_tv_spend']) {
        this.disabled = true;
        this.errors.push("Please enter "+b+" tv spend");
      }
      if(this.digital_platforms[b] && this.digital_platforms[b].length > 0 && !this.input_values_by_brand[b]['total_spend']) {
        this.disabled = true;
        this.errors.push("Please enter "+b+" digital spend");
      }
      // portfolio growth ambition calculation
      if(this.input_values_by_brand[b]['growth_ambition']) {
        new_volume +=  (this.input_values_by_brand[b]['current_volume'] * (this.input_values_by_brand[b]['growth_ambition'] / 100) );
        
      }    

    });    
    this.pga = parseFloat(((new_volume - total_volume) / total_volume * 100).toFixed(1));
    this.reportingPeriod = this.selectedDetails.timeline;
  }

  //select brand from dropdown
  selectBrand(brand:any){
    this.selectedBrand = brand;
   
      if(this.portfolio_brand.indexOf(brand) !== -1 && this.portfolio_brand.length){
        var index = this.portfolio_brand.indexOf(brand);
        if (index >= 0) {
          this.portfolio_brand.splice( index, 1 );
        } 
      } else {
        this.portfolio_brand.push(brand);
      }
    this.getCSVData(brand);
  }

  //get genre, platforms, trade values from database
  getCSVData(brand: any): void {
    //console.log(this.selectedDetails);
    this.selectedDetails.brand = this.selectedBrand;
    let in_data = {
      'country': this.selectedDetails.country,
      'category': this.selectedDetails.category,
      'brand': brand,
      'simulation_id': this.selectedDetails.simulation_id
    }
    this.portfolio_brand.push(this.selectedBrand);

    this.dataService.getCSVData(in_data)
    .subscribe(
       data => {
          //console.log('data',data);
          this.insert_brand = 1;
          this.constraints_value = data;
          let current_brand = this.constraints_value.brand;
          this.input_values_by_brand[current_brand].current_volume = data.total_volume;
          this.input_values_by_brand[current_brand].current_da = Number(data.current_da);
          this.constraints_value.total_volume = Number(data.total_volume);

          this.total_volume[current_brand] =  (data.total_volume/1000000).toFixed(2);
          this.national_da[current_brand] =  data.current_da;
          
          this.tv_total_data[current_brand] =  data.tv_genres.filter((x: any) => x.genre_platform == 'Total').map((d:any)=>{return d} )
        
          this.tv_genres[current_brand] =  data.tv_genres.filter((x: any) => x.genre_platform != 'Total')
           
          this.digital_total_data[current_brand] =  data.digital_platforms.filter((x: any) => x.genre_platform == 'Total').map((d:any)=>{return d} )
          this.channel_trade[current_brand] = data.channel_trade;


          this.channel_trade[current_brand].map((d:any)=>{
            if(d.current_trade == -1){
              d.current_trade = null;
            }
          })
          
          this.digital_platforms[current_brand] =  data.digital_platforms.filter((x: any) => x.genre_platform != 'Total')
          this.constraints_value['tv_genres'] = this.tv_genres[current_brand];
          this.constraints_value['digital_platforms'] = this.digital_platforms[current_brand];
          this.constraints_value['growth_ambition'] = this.input_values_by_brand[current_brand].growth_ambition;
          this.constraints_value['weekly_grp'] = this.input_values_by_brand[current_brand].weekly_grp;
          this.constraints_value['woa'] =  this.input_values_by_brand[current_brand].woa;
          this.constraints_value['total_spend'] =  this.input_values_by_brand[current_brand].total_spend;
          //console.log(this.input_values.total_spend);
          this.constraints_value['total_tv_spend'] =  this.input_values_by_brand[current_brand].total_tv_spend;

          let brand_exists = false;

          this.brand_level_constraints.forEach((val: any)=> {
            if (val.brand == this.constraints_value.brand) {
              brand_exists = true;
            }
          });
           
          if(!brand_exists){
            this.brand_level_constraints.push({'brand_details':this.constraints_value, 'brand':this.constraints_value.brand}) ;
          }
       },
       error => {
        this.notifyService.showError(error,'',3000)
      });
  }

  updateInputData() {
    let input_values_by_brand = this.input_values_by_brand;
    let keys = Object.keys(input_values_by_brand);
    for(let i = 0; i < keys.length; i++) {
      let brand = keys[i];
      for(let j = 0; j < this.brand_level_constraints.length; j++) {
        if (this.brand_level_constraints[j].brand == brand) {
          this.brand_level_constraints[j].brand_details.growth_ambition = input_values_by_brand[brand].growth_ambition;
          this.brand_level_constraints[j].brand_details.total_tv_spend = input_values_by_brand[brand].total_tv_spend;
          this.brand_level_constraints[j].brand_details.woa = input_values_by_brand[brand].woa;
          this.brand_level_constraints[j].brand_details.weekly_grp = input_values_by_brand[brand].weekly_grp;
          this.brand_level_constraints[j].brand_details.total_spend = input_values_by_brand[brand].total_spend;

          this.brand_level_constraints[j].brand_details.channel_trade = this.channel_trade[brand];
          this.brand_level_constraints[j].brand_details.tv_genres = this.tv_genres[brand];
          this.brand_level_constraints[j].brand_details.digital_platforms = this.digital_platforms[brand];
          
        }
      }
    }
  }

  onChange(brand: any, key: any, e: any) {
    //this.input_values_by_brand[brand][key] = '';
  }


  //run Simulator function & save constraincts to DB
  openAlertBox(){
    
    //variable to be passed as input
    // console.log(this.brand_level_constraints);
    // console.log(this.selectedDetails);
    // console.log(this.input_values);
    // console.log(this.brand_list); 
    this.updateInputData();
    
    var d = {
      'brand_level_constraints': this.brand_level_constraints,
      'simulation_id': this.selectedDetails.simulation_id,
      // 'growth_ambition': this.input_values.growth_ambition,
      // 'input_values':this.input_values,
      'brand_list': this.brand_list,
    }

    this.dataService.saveConstraintsToDB(d)
    .subscribe(
      data => { 
        if(data.error) {
          this.notifyService.showError("Please reduce growth ambition or increase spends",'',3000);
          return false;
        } 
        data.input = d;
        this.dataService.setNewValues(data);
        setTimeout(() => {
          this.router.navigateByUrl('/simulator');     
        }, 1000); 
        },
        error => {
          this.notifyService.showError(error,'',3000)
        });

    this.dataService.setSimulationParameters(this.input_values);

  }  
  back(){
    this.location.back();
  }
}
