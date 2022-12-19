import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogInterface, ModalPopupComponent } from '../modal-popup/modal-popup.component';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver'

export interface PeriodicElement {
  id: number;
  user_id:number;
  name: string;
  upload_id: string;
  created_at: number;
  updated_at: number;
  status: string;
  uploadfile: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, user_id: 1, name: 'ABC', upload_id: 'CEGB', status: 'Completed', created_at: 4444444444, updated_at: 55555555, uploadfile: 'James' },
  { id: 2, user_id: 1, name: 'ABC', upload_id: 'CEGB', status: 'Completed', created_at: 4444444444, updated_at: 55555555, uploadfile: 'James' },
  { id: 3, user_id: 1, name: 'ABC', upload_id: 'CEGB', status: 'Completed', created_at: 4444444444, updated_at: 55555555, uploadfile: 'James' },
  { id: 4, user_id: 1, name: 'ABC', upload_id: 'CEGB', status: 'Completed', created_at: 4444444444, updated_at: 55555555, uploadfile: 'James' },
  { id: 5, user_id: 1, name: 'ABC', upload_id: 'CEGB', status: 'Completed', created_at: 4444444444, updated_at: 55555555, uploadfile: 'James' },
  { id: 6, user_id: 1, name: 'ABC', upload_id: 'CEGB', status: 'Completed', created_at: 4444444444, updated_at: 55555555, uploadfile: 'James' }
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['select', 'id', 'user_id','name', 'status', 'created_at', 'uploadfile','download'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  search = "";
  simulations: any;
  isLoadingResults: boolean = true;
  title = 'XLSRead';
  file!: File;
  arrayBuffer: any;
  filelist: any;
  public dialogSubmissionMessage: string = '';
  selected: any;
  uploaddoc = new FormControl('');
  fileName = '';
  uploadS:any = [];
  archivals:any = [];
  btnName:string = "Show Archives";
  private inputUploadName = new Subscription();
  inputDataUplaodName:string = '';

  @ViewChild(MatSort, { static: false }) sort!: MatSort; // For Sort

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(private cdref: ChangeDetectorRef,
    public dialog: MatDialog, private dataService:DataService,private notifyService : NotificationService,
    public location:Location) { }

 

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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngOnInit(): void {
    this.getArchieveUploads();
    this.getUploadsData();
    this.inputDataNameSubscription();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.cdref.detectChanges();

  }
  // pagination and sorting purpose
  paginateAndSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addfile(event:any){
    const file:File = event.target.files[0];
    this.uploadDocument(file);
  }
  
  getUploadsData(){
    this.uploadS = [];
    this.dataService.getUploads().subscribe(data =>{
      let formattedData:any = this.formatTime(data.result)
      this.uploadS = formattedData;
      this.dataSource = new MatTableDataSource(formattedData);
      setTimeout(() =>
            this.paginateAndSort()
          );
    },
    error => {
      this.notifyService.showError(error,'',3000)
    });
  }
  getArchieveUploads(){
    this.archivals = [];
    this.dataService.getArchiveUploads().subscribe(data => {
      let formattedData:any = this.formatTime(data.result)
      this.archivals = formattedData;
      this.dataSource = new MatTableDataSource(formattedData);
      setTimeout(() =>
            this.paginateAndSort()
          );
    },error => {
      this.notifyService.showError(error,'',3000)
    });
  }
  
  
  submitUploadData(file:any) {
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('myfile', file);
      formData.append('name', this.inputDataUplaodName);
      this.dataService.uploadData(formData).subscribe(data => {
        if (data) {
          if (data.result.length === 0) {
            this.notifyService.showSuccess('Upload Successful', '', 3000)
            this.getUploadsData();
            return;
          } else if (data.result[0].message === 'Sheet not found media_records_new') {
            this.notifyService.showError('Please upload valid excel file', '', 3000)
          }
        }
      },error => {
        this.notifyService.showError(error,'',3000)
      })
      // const upload$ = this.http.post("/api/thumbnail-upload", formData);

      // upload$.subscribe();
    }
    this.dialog.closeAll();
  }

  downloadExcel(rowelement: any) {
    let payload = {
      "id": rowelement.id
    }
    this.dataService.downloadadminExcel(payload).subscribe((data:any) =>{
      // downloadFile(data: Response) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        saveAs(blob, `${rowelement.name}.xlsx`);
        this.notifyService.showSuccess('Downloaded file Successfully','',3000)
        // const url= window.URL.createObjectURL(blob,`${rowelement.name}.xlsx`);
        // window.open(url);
      // }
    },error => {
      this.notifyService.showError(error,'',3000)
    })
  }

  archive(){
    let selecteids:any = []
    this.selection.selected.filter(ids =>{
      selecteids.push(ids.id)
    })
    let uploadtestdata ={
      ids: selecteids
    } 
    this.dataService.uploadArchieves(uploadtestdata).subscribe(data => {
      this.getUploadsData();
      this.notifyService.showSuccess('Archived Successfully','',3000);
      this.selection.clear();
    },
    error => {
      this.notifyService.showError(error,'',3000)
      // this.selection.clear();
    });
  }

  formatTime(formatdata:any){
    for(let i=0; i<= formatdata.length-1; i++){
     formatdata[i].updated_at = moment(formatdata[i].updated_at).format('MM-DD-YYYY HH:mm');
     formatdata[i].created_at = moment(formatdata[i].created_at).format('MM-DD-YYYY HH:mm');
    }
    return formatdata;
  }

  showArchiveUploads(){
    this.selection.clear();
    if(this.btnName === 'Show Uploads') {
        this.getUploadsData();
        this.displayedColumns = ['select', 'id', 'user_id','name', 'status', 'created_at', 'uploadfile','download'];
        this.btnName = 'Show Archives';
    } else {
        this.getArchieveUploads();
        this.displayedColumns = ['id', 'user_id','name', 'status', 'created_at', 'uploadfile','download'];
        this.btnName = 'Show Uploads';
    }

  }

  uploadDocument(filename: any) {
    this.uploaddoc.setValue(null)
    const dialogInterface: DialogInterface = {
      dialogHeader: 'Upload',
      dialogContent: filename.name,
      cancelButtonLabel: 'Cancel',
      confirmButtonLabel: 'Upload',
      callbackMethod: () => {
        this.submitUploadData(filename);
      },
    };
    this.dialog.open(ModalPopupComponent, {
      width: '440px',
      // height: '250px',
      data: dialogInterface
    });
    
  }
  inputDataNameSubscription(){
    this.inputUploadName = this.dataService.trigInputName$.subscribe((name)=>{
      this.inputDataUplaodName = name;
    })
  }
  ngOnDestroy() {
    this.inputUploadName.unsubscribe();
  }
  back(){
    this.location.back();
  }
}
