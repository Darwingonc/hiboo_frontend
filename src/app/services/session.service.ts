import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    private url = environment.urlApi;
    private httpClient = inject(HttpClient);
    private router = inject(Router);

    public jwtToken = 'zotYCAeIZ4u0jw';
    public profileToken = 'EjThEY/po1FQGA==';

    constructor() {
    }

    adminsLogin(data: any): Observable<any> {
        return this.httpClient.post(`${this.url}/user/login`, data);
    }

    logout() {
        sessionStorage.clear();
        this.router.navigate(['auth/login']);
    }

    getToken() {
        const token = sessionStorage.getItem(this.jwtToken);

        if (token) {
            return token;
        }

        return null;
    }

    getUuid() {
        const profileToken = sessionStorage.getItem(this.profileToken) || '';
        const user = JSON.parse(atob(profileToken));

        if (user) {
            return user.uuid;
        }

        return null;
    }
}
