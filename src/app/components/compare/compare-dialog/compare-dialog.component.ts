import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { DialogInterface } from '../../modal-popup/modal-popup.component';

@Component({
  selector: 'app-compare-dialog',
  templateUrl: './compare-dialog.component.html',
  styleUrls: ['./compare-dialog.component.css']
})
export class CompareDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CompareDialogComponent>,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  inputErr:boolean = false;
  scenario = new FormControl('', [Validators.required]); 
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  handleDialogSubmit() {
    console.log(this.scenario.value);
    if(this.scenario.value){
      this.sendInputName();
    } else {
      this.inputErr = true;
    }
  }
  closeDialog(): void {
    this.dialogRef.close(this.scenario.value);
  }
  sendInputName(){
    this.dataService.trigInputname(this.scenario.value);
    this.closeDialog();
  }

}
