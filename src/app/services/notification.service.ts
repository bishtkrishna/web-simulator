import { Injectable } from '@angular/core';
   
import { ToastrService } from 'ngx-toastr';
   
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
   
  constructor(private toastr: ToastrService) { }
   
  showSuccess(message:any, title:any,timeOut:number){
      this.toastr.success(message, title, {
        timeOut:timeOut ,
      })
  }
   
  showError(message:any, title:any,timeOut:number){
    this.toastr.error(message, title, {
      timeOut:timeOut ,
    })
}
   
  showInfo(message:any, title:any,timeOut:number){
    this.toastr.info(message, title, {
      timeOut:timeOut ,
    })
}
   
  showWarning(message:any, title:any,timeOut:number){
    this.toastr.warning(message, title, {
      timeOut:timeOut ,
    })
}
   
}
