import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../services/http.service";
import {apiUrls} from "../../../environments/apis/api.urls";
import {Router} from "@angular/router";
import {ActionService} from "../../services/actionService";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup1: FormGroup;
  loginData;

  constructor(private formBuilder: FormBuilder,
              private httpService: HttpService,
              public router: Router,
              private actionservice: ActionService) {
    console.log('Hello')
    this.formGroup1 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6),
        Validators.pattern('((?=.*[a-z])(?=.*[/\\d/])(?=.*[A-Z]).{8,30})')]],
    });
  }

  ngOnInit(): void {

  }

  get email(): FormControl {
    return this.formGroup1.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.formGroup1.get('password') as FormControl;
  }

  submit(formGroup1: FormGroup) {
    console.log(formGroup1.value);
    this.httpService.post(apiUrls.login, {email: this.email.value, password: this.password.value}).subscribe(data => {
      this.loginData = data;
      localStorage.setItem("user_info", this.loginData.token)
      localStorage.setItem("user_object", JSON.stringify(this.loginData.user));

      this.actionservice.loginSubscription.next(false);
      this.router.navigate(['/homepage']);
      formGroup1.reset();
    });

  }
}
