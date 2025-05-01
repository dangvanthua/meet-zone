import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ionArrowForwardOutline, ionCalendar, ionCellularOutline, ionPerson, ionPersonOutline, ionVideocamOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-hero-section',
  imports: [
    NgIcon,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  viewProviders: [
    provideIcons({
      ionPersonOutline,
      ionVideocamOutline,
      ionCalendar,
      ionArrowForwardOutline,
      ionCellularOutline
    })
  ],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
 joinDialogOpen = false;
  meetingCode = '';

  constructor(private router: Router) {}

  toggleDialog() {
    this.joinDialogOpen = !this.joinDialogOpen;
  }

  joinMeeting() {
    const code = this.meetingCode.trim();
    if (code) {
      this.router.navigate(['/meeting', code]);
      this.toggleDialog();
    }
  }
}
