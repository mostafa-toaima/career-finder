import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'step-model',
  imports: [CommonModule, DialogModule],
  templateUrl: './step-model.component.html',
  styleUrl: './step-model.component.html'
})
export class ModelComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>()

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
