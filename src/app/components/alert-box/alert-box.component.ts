import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css']
})
export class AlertBoxComponent implements OnInit {

  constructor(private router: Router, public dialogRef: MatDialogRef<AlertBoxComponent>) { }

  runSimulator(){
    this.router.navigateByUrl('/simulator');
    this.dialogRef.close();

  }

  ngOnInit(): void {
  }

}
