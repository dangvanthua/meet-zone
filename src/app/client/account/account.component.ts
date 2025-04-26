import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";

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
  isLoading = false

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

  constructor() {}

  ngOnInit(): void {
    // Initialization logic here
  }

  handleGoogleLogin(): void {
    this.isLoading = true
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false
      console.log("Google login clicked")
    }, 1500)
  }

  handleLogin(): void {
    this.isLoading = true
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false
      console.log("Login with:", this.loginEmail, this.loginPassword, this.rememberMe)
    }, 1500)
  }

  handleRegister(): void {
    this.isLoading = true
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false
      console.log("Register with:", this.regName, this.regEmail, this.regPassword)
    }, 1500)
  }
}
