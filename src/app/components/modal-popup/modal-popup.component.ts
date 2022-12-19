import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent implements OnInit {

  public dialogSubmissionMessage: string = '';
  inputErr:any = false;
  name = new FormControl('', [Validators.required]); 
  constructor(public dialogRef: MatDialogRef<ModalPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DialogInterface,
    public dataService:DataService
    // public stateService: StateService
    ) { }

  ngOnInit(): void {
    
  }
  handleDialogSubmit() {
    if(this.name.value){
      this.sendInputName();
    } else {
      this.inputErr = true;
    }
    // this.dialogRef.close();
    // this.stateService.isAsyncOperationRunning$.next(true);
    // setTimeout(() => {
      // this.dialogData.callbackMethod();
    //   // this.stateService.isAsyncOperationRunning$.next(false);
    // }, 500);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  sendInputName(){
    this.dataService.trigInputname(this.name.value);
    this.dialogData.callbackMethod();
  }
}
export interface DialogInterface {
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  dialogHeader: string;
  dialogContent: string;
  callbackMethod: () => void;
}
