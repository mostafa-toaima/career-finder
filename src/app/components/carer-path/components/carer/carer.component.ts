import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FrontEndComponent } from '../front-end/front-end.component';
import { CarerService } from '../../services/carer.service';

@Component({
  selector: 'app-carer',
  imports: [CommonModule, RouterLink, FrontEndComponent],
  templateUrl: './carer.component.html',
  styleUrl: './carer.component.css'
})
export class CarerComponent implements OnInit {
  visibleFrontEnd = false;
  trackData: any = null;
  trackId: string = 'frontend';

  constructor(
    private viewportScroller: ViewportScroller,
    private carerService: CarerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.route.params.subscribe((params: any) => {
      this.trackId = params['trackId'] || 'frontend';
      this.loadTrackData();
    });
  }

  loadTrackData(): void {
    this.carerService.getTrack(this.trackId).subscribe(data => {
      if (data) {
        this.trackData = {
          title: data.title || 'Default Title',
          description: data.description || 'Default description',
          benefits: data.benefits || [],
          content: {
            sections: data.content?.sections || [{ content: 'No content available' }]
          },
          pathCards: data.pathCards || []
        };
      } else {
        console.log("no data founded");
      }
    });
  }

}
