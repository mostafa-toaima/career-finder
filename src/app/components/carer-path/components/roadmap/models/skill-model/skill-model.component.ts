import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'skill-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './skill-model.component.html',
  styleUrls: ['./skill-model.component.scss']
})
export class SkillModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() skill: any;
  @Output() statusChange = new EventEmitter<{ skillId: string, status: 'start' | 'in-progress' | 'completed' }>();

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  updateStatus(status: 'start' | 'in-progress' | 'completed'): void {
    this.statusChange.emit({
      skillId: this.skill.id,
      status: status
    });
    this.skill.status = status;
  }
}
