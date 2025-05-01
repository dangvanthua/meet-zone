import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { AuthService } from '../../../services/auth.service';
import { ApiResponse } from '../../../dto/api/api_res';
import { UserRegisterResDto } from '../../../dto/user/user_register';

@Component({
  selector: 'app-account',
  imports: [
    FormsModule,
    CommonModule,
    NavbarComponent
],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  selectedTab: "login" | "register" = "login"
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Login form
  loginEmail = ""
  loginPassword = ""
  rememberMe = false

  // Register form
  regName = ""
  regEmail = ""
  regPassword = ""
  regConfirmPassword = ""
  acceptedTerms = false

  constructor(private authService : AuthService) {}

  ngOnInit(): void {
    // Initialization logic here
  }

  handleGoogleLogin(): void {
    this.isLoading = true;
    this.authService.loginWithGoogle();
    setTimeout(() => {
      this.isLoading = false
      console.log("Google login clicked")
    }, 1500)
  }

  handleLogin(): void {
    this.isLoading = true;
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data?.authenticated) {
          console.log('Login success!');
          window.location.href = '/home';
        } else {
          console.error('Login failed: not authenticated');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
      }
    });
  }

  handleRegister(form: NgForm): void {
    if (form.invalid || this.regPassword !== this.regConfirmPassword) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register({
      full_name: this.regName,
      email: this.regEmail,
      password: this.regPassword,
      re_password: this.regConfirmPassword
    }).subscribe({
      next: (res: ApiResponse<UserRegisterResDto>) => {
        this.isLoading = false;
        this.successMessage = 'Đăng ký thành công! Vui lòng đăng nhập.';
        this.selectedTab = 'login';
        form.resetForm();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Đăng ký thất bại, thử lại sau.';
      }
    });
  }
}
