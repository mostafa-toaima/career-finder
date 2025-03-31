import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'model',
  imports: [CommonModule, DialogModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>()

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
