import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';


@Injectable()
export class MYCUSTOMGUARD implements CanActivate {

  constructor() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (localStorage.getItem('user_info'))
    {
      console.log('user is already logged in PLZ SIGNOUT');
      return  false;
    }
    else
      return true;

  }
}

@Injectable()
export class MYHOMEPAGEGUARD implements CanActivate {

  constructor() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (localStorage.getItem('user_info'))
    {

      return  true;
    }
    else
      console.log('no user  logged in PLZ SINGIN ');

    return false;

  }
}
