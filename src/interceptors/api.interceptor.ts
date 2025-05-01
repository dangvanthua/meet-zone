// api.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // Ensure correct path

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    const apiUrl = environment.apiUrl;

    // List of endpoints that don't require the Authorization header
    const excludedUrls = [
      `${apiUrl}/users/login`,
      `${apiUrl}/users/register`,
      // Add other public endpoints as needed
    ];

    let authReq = req;

    // Only add the token if it exists and the URL is not excluded
    if (token && !excludedUrls.includes(req.url)) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    }

    return next.handle(authReq);
  }
}