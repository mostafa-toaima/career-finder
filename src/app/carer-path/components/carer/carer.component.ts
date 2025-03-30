import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FrontEndComponent } from '../front-end/front-end.component';

@Component({
    selector: 'app-carer',
    imports: [CommonModule, RouterLink, FrontEndComponent],
    templateUrl: './carer.component.html',
    styleUrl: './carer.component.css'
})
export class CarerComponent implements OnInit {
  visibleFrontEnd = false;
  constructor(private viewportScroller: ViewportScroller) { }
  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }
}
