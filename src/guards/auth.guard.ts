import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../dto/api/api_res";
import { UserInfo } from "../dto/user/user_info";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.http
      .get<ApiResponse<UserInfo>>('http://localhost:8080/api/v1/users')
      .pipe(
        map(resp => {
            return resp.data?.user_id
            ? true
            : this.router.parseUrl('/login');
        }),
        catchError(() => {
          return of(this.router.parseUrl('/login'));
        })
      );
  }
}