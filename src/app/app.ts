import { Component } from '@angular/core';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { HomePageComponent } from './components/pages/home-page.component';
import { WhatsAppButtonComponent } from './components/whatsapp-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, WhatsAppButtonComponent, HomePageComponent],
  template: `
    <app-header />
    <main class="pt-16">
      <app-home-page />
    </main>
    <app-footer />
    <!-- <app-whatsapp-button /> -->
  `
})
export class App {}