import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService} from '../../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private session: SessionService, private router: Router) {}

  canActivate(): boolean {
    const token = this.session.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
