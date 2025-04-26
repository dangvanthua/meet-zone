import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionMenu, ionClose } from '@ng-icons/ionicons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NgIcon
  ],
  providers: [
    provideIcons({ ionMenu, ionClose })
  ],
  template: `
    <header
      class="sticky top-0 z-50 w-full transition-all duration-300"
      [ngClass]="{
        'bg-white/95 backdrop-blur-md border-b shadow-sm': isScrolled,
        'bg-transparent': !isScrolled
      }"
    >
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <!-- <img src="/placeholder.svg" alt="MeetApp Logo" class="h-8 w-8" /> -->
          <a routerLink="/home" class="text-xl font-bold bg-gradient-to-r from-sky-500 to-sky-700 text-transparent bg-clip-text">
            MeetZone
          </a>
        </div>

        <!-- Desktop navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <a routerLink="/" fragment="features" class="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors">
            Tính năng
          </a>
          <a routerLink="/" fragment="how-it-works" class="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors">
            Cách sử dụng
          </a>
          <a routerLink="/" fragment="testimonials" class="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors">
            Đánh giá
          </a>
          <a routerLink="/" fragment="contact" class="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors">
            Liên hệ
          </a>
        </nav>

        <!-- Desktop auth buttons -->
        <div class="hidden md:flex items-center gap-4">
          <a routerLink="/account">
            <button class="text-sm font-medium bg-gradient-to-r 
            from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white transition-colors 
            rounded-sm px-3 py-2">
              Đăng nhập
            </button>
          </a>
        </div>

        <!-- Mobile menu trigger -->
        <button (click)="toggleMobileMenu()" class="md:hidden p-2">
          <ng-icon name="ionMenu" size="24"></ng-icon>
          <span class="sr-only">Menu</span>
        </button>
      </div>

      <!-- Mobile menu sheet -->
      <div
        *ngIf="showMobileMenu"
        class="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col"
      >
        <!-- Close button -->
        <div class="flex justify-end p-4">
          <button (click)="toggleMobileMenu()" class="p-2">
            <ng-icon name="ionClose" size="24"></ng-icon>
            <span class="sr-only">Close menu</span>
          </button>
        </div>

        <!-- Mobile nav links -->
        <div class="flex flex-col gap-6 mt-2 px-6">
          <a routerLink="/" fragment="features" (click)="toggleMobileMenu()"
             class="text-base font-medium text-gray-800 hover:text-sky-500 transition-colors">
            Tính năng
          </a>
          <a routerLink="/" fragment="how-it-works" (click)="toggleMobileMenu()"
             class="text-base font-medium text-gray-800 hover:text-sky-500 transition-colors">
            Cách sử dụng
          </a>
          <a routerLink="/" fragment="testimonials" (click)="toggleMobileMenu()"
             class="text-base font-medium text-gray-800 hover:text-sky-500 transition-colors">
            Đánh giá
          </a>
          <a routerLink="/" fragment="contact" (click)="toggleMobileMenu()"
             class="text-base font-medium text-gray-800 hover:text-sky-500 transition-colors">
            Liên hệ
          </a>
        </div>

        <!-- Mobile auth buttons -->
        <div class="flex flex-col gap-3 mt-6 px-6">
          <a routerLink="/login" (click)="toggleMobileMenu()">
            <button class="w-full px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:border-sky-500 transition-colors">
              Đăng nhập
            </button>
          </a>
          <a routerLink="/signup" (click)="toggleMobileMenu()">
            <button class="w-full px-4 py-2 text-sm font-medium rounded bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white transition-colors">
              Đăng ký miễn phí
            </button>
          </a>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  isScrolled = false;
  showMobileMenu = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
