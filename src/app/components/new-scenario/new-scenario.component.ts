import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/services/notification.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-scenario',
  templateUrl: './new-scenario.component.html',
  styleUrls: ['./new-scenario.component.css'],
})
export class NewScenarioComponent implements OnInit {
  authenticated = false;
  countries: any = [];
  categories: any = [];
  brands: any = [];
  selectedCountry: any = '';
  selectedCategory: any = '';
  selectedCountrytimeline:any = '';

  submitted = false;
  showsuccessMsg = 'Simulation created';
  successful = false;
  selectedBands: any;
  simulation_detail: any = {};
  selected_brands: any = [];
  view_simulation = false;

  toppings = new FormControl();

  toppingList: string[] = [
    'Country-1',
    'Country-2',
    'Country-3',
    'Country-4',
    'Country-5',
    'Country-6',
  ];

  constructor(
    private commonService: CommonService,
    private router: Router,
    private http: HttpClient,
    private notifyService : NotificationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Emitters.authEmitter.subscribe(auth=>{
    //   this.authenticated = auth;
    // })

    // if simulation id exists
    if (this.commonService.view_simulation_id) {
      this.commonService
        .viewSimulationById({ id: this.commonService.view_simulation_id })
        .subscribe(
          (data) => {
            this.simulation_detail = data.simulation_detail[0];
            this.selectedCountry = this.simulation_detail.country_name;
            this.view_simulation = true;
          },
          error => {
            this.notifyService.showError(error,'',3000)
          }
        );
    }

    this.commonService.getCountries().subscribe(
      (data) => {
        this.countries = data.countries;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  simulationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    country_name: new FormControl('', [Validators.required]),
    simulation_category: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    analysis_period: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.simulationForm.controls;
  }

  // Save simulation
  submit() {
    if (this.view_simulation == true) {
      var b = this.simulation_detail.brand_name.split(',');
      this.simulation_detail['brand'] = b[1];
      this.simulation_detail['simulation_id'] =
        this.commonService.view_simulation_id;
      this.commonService.setSelectedDetails(this.simulation_detail);
      var b = this.simulation_detail.brand_name.split(',');
      this.commonService.setBrandList(b);
      setTimeout(() => {
        this.router.navigateByUrl('/input_constraint');
      }, 100);
    } else {
      this.submitted = true;
      this.commonService.createSimuation(this.simulationForm.value).subscribe(
        (response) => {
          this.commonService.setSelectedDetails(response);
          var b = response.brand.split(',');
          response['brand'] = b[1];
          this.commonService.setSelectedDetails(response);
          // console.log(response);
          this.commonService.view_simulation_id = response['simulation_id'];
          this.successful = true;
          setTimeout(() => {
            this.router.navigateByUrl('/input_constraint');
          }, 100);
        },
        (error) => {
          this.submitted = true;
          console.log(error);
          this.notifyService.showError(error.error, '', 3000);
        }
      );
    }
  }

  // select catgeory from button available
  selectCategory(category_name: any) {
    this.simulationForm.controls.simulation_category.setValue(category_name);
    this.commonService.getBrands({ name: category_name, country: this.selectedCountry.country }).subscribe(
      (data) => {
        data.brands.map((d: any) => {
          d.isClicked = false;
        });
        this.brands = data.brands;
        this.commonService.setBrandList(this.brands);
      },
      error => {
        this.notifyService.showError(error,'',3000)
      }
    );
  }

  // select brand from buttons available
  selectBrand(brand: any) {
    if (!brand.isClicked) {
      this.selected_brands.push(brand.brand);
    } else {
      if (this.selected_brands.indexOf(brand.brand) !== -1) {
        var index = this.selected_brands.indexOf(brand.brand);
        if (index >= 0) {
          this.selected_brands.splice(index, 1);
        }
      }
    }
    this.simulationForm.controls.brand.setValue(this.selected_brands);
    this.commonService.setBrandList(this.selected_brands);
  }

  //change/select country from dropdown
  changeCountry(country_name: any) {
    this.simulationForm.controls.analysis_period.setValue(
      country_name.analysis_period
    );
    this.selectedCountrytimeline = country_name.analysis_period
    this.commonService.getCategories({ name: country_name.country }).subscribe(
      (data) => {
        data.categories.map((d: any) => {
          d.isClicked = false;
        });
        this.categories = data.categories;
      },
      error => {
        this.notifyService.showError(error,'',3000)
      }
    );
  }

  logout(): void {
    this.http
      .post('http://localhost:8000/api/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this.authenticated = false;
        this.router.navigateByUrl('/login');
      },error => {
        this.notifyService.showError(error,'',3000)
      });
  }
  back(){
    this.location.back();
  }
}
