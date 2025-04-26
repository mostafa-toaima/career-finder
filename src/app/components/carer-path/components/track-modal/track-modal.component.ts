import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Track } from '../../interfaces/Track';

@Component({
  selector: 'track-modal',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './track-modal.component.html',
  styleUrls: ['./track-modal.component.css']
})
export class TrackModalComponent {
  @Input() visible = false;
  @Input() trackData?: Track;
  @Output() visibleChange = new EventEmitter<boolean>();

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  get modalHeader(): string {
    return this.trackData?.title ? `${this.trackData.title} Learning Path` : 'Learning Path';
  }
}
