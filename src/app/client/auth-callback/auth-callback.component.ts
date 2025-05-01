import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenResDto } from '../../../dto/token/token_res';
import { ApiResponse } from '../../../dto/api/api_res';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent {
  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.authService.exchangeCodeForToken(code).subscribe({
        next: (response: ApiResponse<TokenResDto>) => {
          const data = response.data;
          if (data.authenticated) {
            localStorage.setItem('access_token', data.access_token);
            window.location.href = '/home';
          } else {
            console.error('Authentication failed');
          }
        },
        error: (error) => {
          console.error('Error exchanging code for token:', error);
        },
      });
    }
  }
}
