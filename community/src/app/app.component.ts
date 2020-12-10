import {Component} from '@angular/core';
import {ActionService} from "./services/actionService";
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
export let signOutValue = [false];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  checkSignout = true;
  title = 'community';

  constructor(private actionService: ActionService,
              private socket:Socket) {

    socket.emit("message", "Message from Mutahir");

    socket.on("connect", (data)=>{
      console.log('connected', data);
    })
    socket.on("disconnect", (data)=>{
      console.log('disconnected',  data);
    })
    socket.on("event", (data)=>{
      console.log('event', data);
    })

  }


  ngOnInit() {

    this.actionService.loginSubscription
      .subscribe((value: boolean) => {
        this.checkSignout = value;
      });
    if (localStorage.getItem('user_info')){
      this.actionService.loginSubscription.next(false)
    }
  }

  abc() {
    console.log('working')
  }
}
