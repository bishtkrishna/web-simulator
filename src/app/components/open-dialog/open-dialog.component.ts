import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-open-dialog',
  templateUrl: './open-dialog.component.html',
  styleUrls: ['./open-dialog.component.css']
})
export class OpenDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OpenDialogComponent>) { }
  public scenario_name:string = "";
  enter_scenario = false;

  saveScenario(){
    if(this.scenario_name == ""){
      this.enter_scenario = true;
      setTimeout(() => {
        console.log('i')
        this.enter_scenario = false;
      }, 2000);
    } else {
      this.dialogRef.close(this.scenario_name);
    }
  }

  ngOnInit(): void {
  }

}
