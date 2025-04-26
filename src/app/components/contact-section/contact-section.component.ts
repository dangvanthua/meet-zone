import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCheckmarkCircleOutline, ionLogoFacebook, ionLogoInstagram, ionLogoLinkedin, ionLogoTwitter, ionMailOutline, ionMapOutline, ionNotifications, ionPhonePortraitOutline, ionSendOutline, ionStopwatchOutline } from '@ng-icons/ionicons';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact-section',
  imports: [
    NgIcon,
    CommonModule,
    FormsModule
  ],
  viewProviders: [provideIcons({
    ionPhonePortraitOutline,
    ionStopwatchOutline,
    ionLogoFacebook,
    ionLogoTwitter,
    ionLogoInstagram,
    ionLogoLinkedin,
    ionMapOutline,
    ionSendOutline,
    ionCheckmarkCircleOutline,
    ionNotifications,
    ionMailOutline
  })],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss'
})
export class ContactSectionComponent {
  formState: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  formData: ContactFormData = { name: '', email: '', subject: '', message: '' };

  onSubmit() {
    if (this.formState === 'submitting') return;
    this.formState = 'submitting';
    window.setTimeout(() => {
      // simulate success
      this.formState = 'success';
      window.setTimeout(() => {
        this.formState = 'idle';
        this.formData = { name: '', email: '', subject: '', message: '' };
      }, 3000);
    }, 1500);
  }
}
