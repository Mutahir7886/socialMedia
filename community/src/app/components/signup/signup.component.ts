import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../custom-validators";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../services/http.service";
import {ActionService} from "../../services/actionService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formGroup: FormGroup;
   signUpData;
   imageValue;

  constructor(private formBuilder: FormBuilder,
              private httpService: HttpService,
              private actionservice: ActionService,
              public router: Router)
  {
    this.formGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6),
                         Validators.pattern('((?=.*[a-z])(?=.*[!@#\\$%\\^&\\*])(?=.*[/\\d/])(?=.*[A-Z]).{8,30})')]],
        confirm_password: ['', [Validators.required]],
        first_name: ['', Validators.required],
        last_name: ['' , Validators.required],
        gender: ['', Validators.required],
        userPic:['']

      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      });
  }

  ngOnInit(): void {
  }
  get userPic(): FormControl {
    return this.formGroup.get('userPic') as FormControl;
  }
  get email(): FormControl {
    return this.formGroup.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.formGroup.get('password') as FormControl;
  }
  get first_name(): FormControl {
    return this.formGroup.get('first_name') as FormControl;
  }
  get last_name(): FormControl {
    return this.formGroup.get('last_name') as FormControl;
  }
  get confirm_password(): FormControl {
    return this.formGroup.get('confirm_password') as FormControl;
  }
  get gender(): FormControl {
    return this.formGroup.get('gender') as FormControl;
  }
  submit(formGroup: FormGroup):void {
    console.log(formGroup.value);
    this.httpService.post(apiUrls.signup, {email: this.email.value,
                                                password: this.password.value,
                                                first_name:this.first_name.value,
                                                  last_name:this.last_name.value,
                                                  gender:this.gender.value,
                                                  profile_pic:this.userPic.value}).subscribe(data => {
      this.signUpData = data;
       localStorage.setItem("user_info", this.signUpData.token);
      localStorage.setItem("user_object", JSON.stringify(this.signUpData.user));
      this.actionservice.loginSubscription.next(false);
       this.router.navigate(['/homepage']);
      formGroup.reset();

    });
  }

  readUrl(files: any) {
    let mimeType;
    let file;
    if (files.target) {
      if (files.target.files.length === 0) {
        return;
      }
      // Image upload validation
      mimeType = files.target.files[0].type;
      file = files.target.files[0];
    } else {
      mimeType = files.type;
      file = files;
    }
    if (mimeType.match(/image\/*/) == null) {
      // this.toaster.error('Wrong Image selected');
      return;
    }

    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      console.log('yes');
      this.imageValue = reader.result;
      this.userPic.setValue(this.imageValue);
    };
  }
}
