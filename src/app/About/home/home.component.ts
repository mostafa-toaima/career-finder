import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SignUpComponent } from '../../auth/sign-up/sign-up.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink , SignUpComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  visible: boolean = false;

  signUp() {
    this.visible = true;
  }

}
