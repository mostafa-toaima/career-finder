import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { SignUpComponent } from '../../auth/components/sign-up/sign-up.component';

@Component({
  selector: 'app-home',
  imports: [SignUpComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private viewportScroller: ViewportScroller) { }
  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }
  visible: boolean = false;

  signUp() {
    this.visible = true;
  }

}
