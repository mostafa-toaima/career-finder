import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-features',
    imports: [RouterLink],
    templateUrl: './features.component.html',
    styleUrl: './features.component.css'
})
export class FeaturesComponent implements OnInit {

  constructor(private viewportScroller: ViewportScroller) {}
  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }
}
