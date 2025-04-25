// skill-model.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'skill-model',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './skill-model.component.html',
  styleUrls: ['./skill-model.component.css']
})
export class SkillModelComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() data: any;
  @Output() statusChanged = new EventEmitter<{
    skillId: string,
    status: 'start' | 'in-progress' | 'complete'
  }>();

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  setStatus(status: 'start' | 'in-progress' | 'complete') {
    if (this.data?.id) {
      this.statusChanged.emit({
        skillId: this.data.id,
        status: status
      });
      this.data.status = status; // Update local data
    }
  }
}
