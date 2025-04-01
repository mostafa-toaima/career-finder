import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { FooterComponent } from './common/components/footer/footer.component';
import { NavbarComponent } from './common/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'career-path-project';
}
