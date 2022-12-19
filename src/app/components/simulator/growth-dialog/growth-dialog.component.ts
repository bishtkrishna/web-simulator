import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-growth-dialog',
  templateUrl: './growth-dialog.component.html',
  styleUrls: ['./growth-dialog.component.css']
})
export class GrowthDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GrowthDialogComponent>,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

  inputErr:boolean = false;
  scenario = new FormControl('', [Validators.required]); 
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    //console.log(this.data);
  }

  onNoSaveClick(){
    this.data.callbackMethod();
  }

  onYesClick(){
    this.data.callbackYesMethod();
  }

}
export interface DialogInterface {
  tryscenario:boolean;
  message: string;
  callbackMethod: () => void;
  callbackYesMethod: () => void;
}