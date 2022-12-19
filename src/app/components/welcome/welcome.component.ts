import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ExecutionService } from 'src/app/services/execution.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  hide = true;
  register = true;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private user: ExecutionService,
    private login: UserService,
    private notifyService: NotificationService
  ) {
    this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        // Get your url
        if(routerEvent.url == '/register'){
          this.register = false;
        }
      }
    });
  }

  // emailFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.email,
  // ]);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]],
      confirmpassword: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  loginSubmit() {
    this.submitted = true;
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.user.login(this.loginForm.value).subscribe(res=>{
        console.log(res);
        this.login.loggedin = true;
        this.router.navigate(['/scenario'])
      },error => {
        this.notifyService.showError(error,'',3000)
      })
    }
  }

  registerSubmit() {
    console.log(this.registerForm.value);
    
    this.submitted = true;
    if(this.registerForm.valid){
      console.log(this.registerForm.value);
      this.user.register(this.registerForm.value).subscribe(res=>{
        console.log(res);
        this.router.navigate(['/login'])
      },error => {
        this.notifyService.showError(error,'',3000)
      })
    }
  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  get r() { return this.registerForm.controls; }

}
