import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'front-end',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './front-end.component.html',
  styleUrl: './front-end.component.css'
})
export class FrontEndComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>()

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
