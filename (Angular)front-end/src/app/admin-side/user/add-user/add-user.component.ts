import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { AdminloginService } from 'src/app/service/adminlogin.service';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor(public fb:FormBuilder,private service:AdminloginService,private toastr:ToastrService,private router:Router,public toast:NgToastService) { }
  registerForm:FormGroup;
  formValid:boolean;
  ngOnInit(): void {
    this.createRegisterForm();
  }
  createRegisterForm(){
    this.registerForm = this.fb.group({
      firstName:[null,Validators.compose([Validators.required])],
      lastName:[null,Validators.compose([Validators.required])],
      emailAddress:[null,Validators.compose([Validators.required,Validators.email])],
      password:[null,Validators.compose([Validators.required,Validators.minLength(5),Validators.maxLength(10)])],
      confirmPassword:[null,Validators.compose([Validators.required])]
    },{validator : [this.passwordCompareValidator],});
  }
  passwordCompareValidator(fc:AbstractControl):ValidationErrors | null{
      return fc.get('password')?.value === fc.get('confirmPassword')?.value ? null : {notmatched : true}
  }
  get firstName()
  {
    return this.registerForm.get('firstName') as FormControl;
  }
  get lastName()
  {
    return this.registerForm.get('lastName') as FormControl;
  }
 
  get emailAddress()
  {
    return this.registerForm.get('emailAddress') as FormControl;
  }
  get password()
  {
    return this.registerForm.get('password') as FormControl;
  }
  get confirmPassword()
  {
    return this.registerForm.get('confirmPassword') as FormControl;
  }
  OnSubmit() {
    console.log("form submitted");
    this.formValid = true;
    console.log("formValid:", this.formValid); // Add this line
    console.log("form valid:", this.registerForm.valid); // Add this line
    if (this.registerForm.valid) {
      console.log("valid entry"); // This line is already present
      const registerData = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        emailAddress: this.registerForm.value.emailAddress,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
        userType: 'user',
        phoneNumber: '1234567890'
      };
  
      this.service.registerUser(registerData).subscribe(
        (response: any) => {
          // Handle successful registration
          this.toast.success({ detail: "SUCCESS", summary: response.message, duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['admin/userPage']);
          }, 1000);
        },
        (error: any) => {
          // Handle error
          this.toast.error({ detail: "ERROR", summary: error.message || error.error, duration: 3000 });
        }
      );
      this.formValid = false;
    }
  }
}
