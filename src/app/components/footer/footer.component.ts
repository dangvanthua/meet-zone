import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCallOutline, ionLogoFacebook, ionLogoGithub, ionLogoInstagram, ionLogoLinkedin, ionLogoTwitter, ionMailOutline, ionMapOutline, ionVideocamOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-footer',
  imports: [NgIcon],
  viewProviders: [provideIcons({
      ionMapOutline,
      ionCallOutline,
      ionMailOutline,
      ionLogoFacebook,
      ionLogoTwitter,
      ionLogoInstagram,
      ionLogoLinkedin,
      ionLogoGithub,
      ionVideocamOutline
  })],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
