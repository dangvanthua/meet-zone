import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionMenu, ionClose } from '@ng-icons/ionicons';
import { Observable } from 'rxjs';
import { UserInfo } from '../../../dto/user/user_info';
import { AuthService } from '../../../services/auth.service';

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

    <!-- Desktop auth section -->
    <div class="hidden md:block">
      <ng-container *ngIf="currentUser$ | async as user; else desktopLoginButton">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <!-- Avatar desktop -->
            <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <ng-container *ngIf="user.avatar_url; else fallbackAvatar">
                <img [src]="user.avatar_url" alt="Avatar" class="h-8 w-8 rounded-full object-cover border border-gray-200" />
              </ng-container>
              <ng-template #fallbackAvatar>
                <div class="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    [ngStyle]="{ backgroundColor: getAvatarColor(user.full_name) }">
                  {{ getInitial(user.full_name) }}
                </div>
              </ng-template>
              <span class="font-medium text-gray-700">{{ user.full_name }}</span>
            </div>
          </div>
          <button (click)="logout()" class="text-sm px-3 py-1.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-md transition-colors">
            Đăng xuất
          </button>
        </div>
      </ng-container>
      
      <ng-template #desktopLoginButton>
        <a routerLink="/account">
          <button class="text-sm font-medium bg-gradient-to-r 
                        from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 
                        text-white rounded-md px-4 py-2 transition-colors">
            Đăng nhập
          </button>
        </a>
      </ng-template>
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

    <!-- Mobile auth section -->
    <div class="mt-8 px-6">
      <ng-container *ngIf="currentUser$ | async as user; else mobileLoginButton">
        <div class="flex flex-col items-center gap-4 py-4 border-t border-gray-200">
          <!-- Avatar mobile -->
          <ng-container *ngIf="user.avatar_url; else fallbackMobileAvatar">
            <img [src]="user.avatar_url" alt="Avatar" class="h-16 w-16 rounded-full object-cover border-2 border-sky-500" />
          </ng-container>
          <ng-template #fallbackMobileAvatar>
            <div class="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-semibold border-2 border-sky-500"
                [ngStyle]="{ backgroundColor: getAvatarColor(user.full_name) }">
              {{ getInitial(user.full_name) }}
            </div>
          </ng-template>
          <span class="font-medium text-lg text-gray-800">{{ user.full_name }}</span>
          <button (click)="logout()" class="w-full text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors">
            Đăng xuất
          </button>
        </div>
      </ng-container>
      
      <ng-template #mobileLoginButton>
        <div class="flex justify-center py-4 border-t border-gray-200">
          <a routerLink="/account" (click)="toggleMobileMenu()" class="w-full">
            <button class="w-full text-sm font-medium bg-gradient-to-r 
                          from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 
                          text-white rounded-md px-4 py-2 transition-colors">
              Đăng nhập
            </button>
          </a>
        </div>
      </ng-template>
    </div>
  </div>
</header>
  `
})
export class NavbarComponent {
  isScrolled = false;
  showMobileMenu = false;
  currentUser$: Observable<UserInfo | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() || '?';
  }
  
  getAvatarColor(name: string): string {
    const colors = ['#0ea5e9', '#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }
  

  logout(): void {
    this.authService.logout();
  }
}
