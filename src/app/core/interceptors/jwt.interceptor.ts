import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {SessionService} from "../../services/session.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const sessionService = inject(SessionService);
    const token = sessionService.getToken();

    if (!token) {
        return next(req);
    }

    const headers = req.clone({
        headers: req.headers.set('Authorization', `${token}`),
    });

    return next(headers);
};
