import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoutingService } from '../../routing/facade/routing.service';
import { AuthService } from '../facade/auth.service';
import { AuthRedirectService } from './auth-redirect.service';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  static GUARD_NAME = 'NotAuthGuard';

  constructor(
    protected routingService: RoutingService,
    protected authService: AuthService,
    private router: Router,
    private authRedirectService: AuthRedirectService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // report the current navigation in case if we want to redirect back after login:
    const url = state.url;
    const lastActivatedUrl = this.router.url;
    const navigationId = this.router.getCurrentNavigation().id;
    this.authRedirectService.reportNotAuthGuard(
      url,
      lastActivatedUrl,
      navigationId
    );

    // redirect, if user is already logged in:
    return this.authService.getUserToken().pipe(
      map(token => {
        if (token.access_token) {
          this.routingService.go({ cxRoute: 'home' }); // spike todo - redirect to previous page
        }
        return !token.access_token;
      })
    );
  }
}
