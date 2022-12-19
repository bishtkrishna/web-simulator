import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {

  model:any;
  execution: any = false;
  media:any = false;
  media_graph: any = false;
  media_table: any = false;
  selectedScenario = "";

  scenarios: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  constructor(){
     
  }

  onExecution(){
    this.execution = true;
    this.media = false;

  }

  showMedia(){
    this.media = true;
    this.execution = false;

  }

    title = 'appComponent';
    
  isShowDiv = true;
   
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  ngOnInit(): void {
  }

}
