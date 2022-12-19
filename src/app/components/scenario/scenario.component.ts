import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';

export interface PeriodicElement {
  position: number;
  name: string;
  market: string;
  category: string;
  brand: string;
  created: number;
  modified: number;
  status: string;
  createdby: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
];

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css'],
})
export class ScenarioComponent implements AfterViewInit {
  @ViewChild(MatSort, { static: false }) sort!: MatSort; // For Sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.cdref.detectChanges();
  }
  // pagination and sorting purpose
  paginateAndSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = [ 
    'select',
    'id',
    'name',
    'market',
    'category',
    'brand',
    'created',
    'modified',
    'status',
    'createdby',
    'view_details',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  search = '';
  simulations: any;

  constructor(
    private cdref: ChangeDetectorRef,
    private commonService: CommonService,
    private router: Router,
    private notification: NotificationService
  ) {}

  viewDetails(id: any) {
    this.commonService.view_simulation_id = id;
    this.router.navigateByUrl('/new_scenario');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  brand = new FormControl();
  brandList: string[] = [];

  market = new FormControl();
  marketList: string[] = [];

  category = new FormControl();
  categoryList: string[] = [];

  user = new FormControl();
  userList: any[] = [];

  status = new FormControl();
  statusList: any[] = [{"name": "In Draft", "status": 1}, {"name": "In Progress", "status": 2}, {"name": "Complted", "status": 3}, {"name": "Archived", "status": 4}, {"name": "Error", "status": 5}];

  applyFilter(event: any) {
    let filterValue = event.target.value.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource
    this.dataSource.filter = filterValue;
  }
  filterPanel() {
    let brandForm = this.brand;
    let marketForm = this.market;
    let categoryForm = this.category;
    let userForm = this.user;
    let statusForm = this.status;
    let sim = [];
    let simulations;
    if( 
      (brandForm.value && brandForm.value.length > 0) || 
      (marketForm.value && marketForm.value.length > 0) || 
      (categoryForm.value && categoryForm.value.length > 0) || 
      (userForm.value && userForm.value.length > 0) || 
      (statusForm.value && statusForm.value.length > 0)
    ) {
      simulations = this.simulations.filter((x:any) => {
        let brands = x.brand_name.split(',');
        let res = true;
        if(brandForm.value && brandForm.value.length > 0) {
          res = false;
          brands.forEach((b:any)=> {
            if(brandForm.value.includes(b)) {
              res = true;
            }
            
          });
        }
        
        if(marketForm.value && marketForm.value.length > 0 && !marketForm.value.includes(x.country)) {
          res = false;
        }
        if(categoryForm.value && categoryForm.value.length > 0 && !categoryForm.value.includes(x.category)) {
          res = false;
        }
        if(userForm.value && userForm.value.length > 0 && !userForm.value.includes(x.created_by)) {
          res = false;
        }
        if(statusForm.value && statusForm.value.length > 0 && !statusForm.value.includes(x.status)) {
          res = false;
        }
        return res;
      });
    }else {
      simulations = this.simulations;
    }
    
    this.dataSource = new MatTableDataSource(simulations);
    setTimeout(() =>
            this.paginateAndSort()
          );
  }
  ngOnInit(): void {
    this.commonService.view_simulation_id = '';
    //get simulation details stored in db
    this.commonService.getUsers().subscribe(
      (data) => {
        this.userList = data.result;
      },
      error => {
        this.notification.showError(error,'',3000)
      }
    );
    this.commonService.getSimulations().subscribe(
      (data) => {
        data.simulations.forEach((d: any) => {
          let brands = d.brand_name.split(',');
          brands.forEach((brand: any) => {
            if (!this.brandList.includes(brand)) {
              this.brandList.push(brand);
            }            
          });
          if(!this.marketList.includes(d.country)) {
            this.marketList.push(d.country);
          }
          if(!this.categoryList.includes(d.category)) {
            this.categoryList.push(d.category);
          }
          
          //
        });
        this.simulations = data.simulations;
        let formattedData:any = this.formatTime(data.simulations)
        this.dataSource = new MatTableDataSource(formattedData);
        setTimeout(() =>
            this.paginateAndSort()
          );
      },
      error => {
        this.notification.showError(error,'',3000)
      }
    );
  }

  archive(): void {
    let selected: any[] = [];
    this.dataSource.data.forEach((row) => {
      if (this.selection.isSelected(row)) {
        selected.push(row);
        
      }
    });
    if (selected.length == 0) {
      this.notification.showError('Please select atleast one row to archive simulation','',3000);
      return;
    }
    let data = selected;
    this.commonService.archive(data).subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.result);
        this.notification.showSuccess('Simulation Archieved Successfully','',3000);
      },
      error => {
        this.notification.showError(error,'',3000)
      }
    );
  }

  duplicate(): void {
    let selected: any[] = [];
    this.dataSource.data.forEach((row) => {
      if (this.selection.isSelected(row)) {
        selected.push(row);
      }
    });
    if (selected.length > 1) {
      this.notification.showError(
        'Please select only one row to duplicate simulation',
        '',
        3000
      );
      return;
    }
    if (selected.length == 0) {
      this.notification.showError(
        'Please select one row to duplicate simulation',
        '',
        3000
      );
      return;
    }
    let data = selected[0];
    this.commonService.duplicate(data).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data.result);
        this.notification.showSuccess('Simulation Duplicated Successfully','',3000);
      },
      error => {
        this.notification.showError(error,'',3000)
      }
    );
  }

  formatTime(formatdata:any){
    for(let i=0; i<= formatdata.length-1; i++){
     formatdata[i].updated_at = moment(formatdata[i].updated_at).format('MM-DD-YYYY HH:mm');
     formatdata[i].created_at = moment(formatdata[i].created_at).format('MM-DD-YYYY HH:mm');
    }
    return formatdata;
  }
}
