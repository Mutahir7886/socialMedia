import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignupComponent} from "./components/signup/signup.component";
import {LoginComponent} from "./components/login/login.component";
import {HomepageComponent} from "./components/homepage/homepage.component";
import {MYCUSTOMGUARD, MYHOMEPAGEGUARD} from "./services/Guard";
import {DjangoComponent} from "./components/django/django.component";
import {ResumeDetailComponent} from "./components/resume-detail/resume-detail.component";

const routes: Routes = [
  {path: 'signup', component: SignupComponent , canActivate: [MYCUSTOMGUARD]},
  {path: 'login', component: LoginComponent, canActivate: [MYCUSTOMGUARD]},
  {path: 'homepage', component: HomepageComponent , canActivate: [MYHOMEPAGEGUARD]},
  {path: 'resume', component: DjangoComponent },
  {path: 'resume/:name/:id/details', component: ResumeDetailComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
