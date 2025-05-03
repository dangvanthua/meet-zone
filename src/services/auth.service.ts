import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import * as crypto from 'crypto-js';
import { TokenResDto } from '../dto/token/token_res';
import { ApiResponse } from '../dto/api/api_res';
import { UserInfo } from '../dto/user/user_info';
import { UserRegisterResDto } from '../dto/user/user_register';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly codeVerifierKey = 'code_verifier';
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
    this.loadUserProfile().subscribe();
  }

  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  register(dto: {
    full_name: string;
    email: string;
    password: string;
    re_password: string;
  }): Observable<ApiResponse<UserRegisterResDto>> {
    return this.http.post<ApiResponse<UserRegisterResDto>>(
      `${this.apiUrl}/register`,
      dto,
      { withCredentials: false }
    );
  }
  
  loginWithGoogle(): void {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = crypto.SHA256(codeVerifier)
      .toString(crypto.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    localStorage.setItem(this.codeVerifierKey, codeVerifier);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${environment.clientId}&` +
      `redirect_uri=${environment.redirectUri}&` +
      `response_type=code&scope=openid%20email%20profile&` +
      `code_challenge=${codeChallenge}&code_challenge_method=S256`;

    window.location.href = authUrl;
  }

  exchangeCodeForToken(code: string): Observable<ApiResponse<TokenResDto>> {
    localStorage.removeItem('access_token');
    const codeVerifier = localStorage.getItem(this.codeVerifierKey) || '';
    localStorage.removeItem(this.codeVerifierKey);

    const body = new HttpParams()
      .set('code', code)
      .set('code_verifier', codeVerifier);

    return this.http.post<ApiResponse<TokenResDto>>(
      `${this.apiUrl}/login-social`,
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      }
    ).pipe(
      tap(response => {
        if (response.data?.access_token) {
          // Lưu token vào localStorage để interceptor có thể đọc
          localStorage.setItem('access_token', response.data.access_token);
          // Sau khi có token, load profile
          this.loadUserProfile().subscribe();
        }
      })
    );
  }

  login(email: string, password: string): Observable<ApiResponse<TokenResDto>> {
    localStorage.removeItem('access_token'); 
    return this.http.post<ApiResponse<TokenResDto>>(
      `${this.apiUrl}/login`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.data?.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          this.loadUserProfile().subscribe();
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of({ code: 500, message: 'Login failed', data: {} as TokenResDto });
      })
    );
  }

  /** Gọi backend lấy profile user đã xác thực */
  loadUserProfile(): Observable<UserInfo | null> {
    return this.http.get<ApiResponse<UserInfo>>(
      `${this.apiUrl}/profile`,
      { withCredentials: true }
    ).pipe(
      map((res: ApiResponse<UserInfo>) => res.data),
      tap(user => this.currentUserSubject.next(user ?? null)),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  /** Logout: xóa token và thông tin user */
  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
    // Optionally call backend /users/logout to clear cookie
  }
}