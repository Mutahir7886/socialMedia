import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule, NgbPopover, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpConfigInterceptor} from './shared/HttpConfigInterceptor';
import { HomepageComponent } from './components/homepage/homepage.component'
import {MYCUSTOMGUARD, MYHOMEPAGEGUARD} from "./services/Guard";
import {MatPaginatorModule} from "@angular/material/paginator";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {environment} from "../environments/environment";
import {MatTabsModule} from "@angular/material/tabs";
import { DjangoComponent } from './components/django/django.component';
import { ResumeDetailComponent } from './components/resume-detail/resume-detail.component';
const config: SocketIoConfig = { url: environment.baseUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    HomepageComponent,
    DjangoComponent,
    ResumeDetailComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatPaginatorModule,
    NgbPopoverModule,
    SocketIoModule.forRoot(config),
    MatTabsModule

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},MYCUSTOMGUARD,MYHOMEPAGEGUARD],
  bootstrap: [AppComponent]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);

