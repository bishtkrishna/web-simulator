import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  title = 'toaster-not';
   
  constructor(private notifyService : NotificationService) { }
   
  showToasterSuccess(){
      this.notifyService.showSuccess("Data shown successfully !!",'',3000)
  }
   
  showToasterError(){
      this.notifyService.showError("Something is wrong", '',3000)
  }
   
  showToasterInfo(){
      this.notifyService.showInfo("This is info", '',3000)
  }
   
  showToasterWarning(){
      this.notifyService.showWarning("This is warning", '',3000)
  }

}
