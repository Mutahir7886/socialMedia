import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable, Subject} from 'rxjs';


@Injectable({providedIn: 'root'})
export class ActionService {
  loginSubscription = new Subject();

}
