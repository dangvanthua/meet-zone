import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FeatureSectionComponent } from "../../components/feature-section/feature-section.component";
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";
import { HowItWorkComponent } from "../../components/how-it-work/how-it-work.component";
import { ContactSectionComponent } from "../../components/contact-section/contact-section.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    FeatureSectionComponent,
    HeroSectionComponent,
    HowItWorkComponent,
    ContactSectionComponent,
    FooterComponent
],
  template: `
  <div class="flex min-h-screen flex-col">
      <app-navbar></app-navbar>
      <main class="flex-1">
        <app-hero-section></app-hero-section>
        <app-feature-section></app-feature-section>
        <app-how-it-work></app-how-it-work>
        <app-contact-section></app-contact-section>
      </main>
      <app-footer></app-footer>
    </div>
  `,
})
export class HomeComponent {

}
