import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrackService } from '../../../services/track.service';

type FilterOption = 'all' | 'completed' | 'in-progress' | 'not-started';

@Component({
  selector: 'path-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './path-header.component.html',
  styleUrls: ['./path-header.component.scss']
})
export class PathHeaderComponent {
  @Input() title = '';
  @Input() selectedFilter: FilterOption = 'all';
  @Input() completionPercentage = 0;
  @Output() selectedFilterChange = new EventEmitter<FilterOption>();

  filterOptions = [
    { value: 'all', label: 'All Steps' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-started', label: 'Not Started' }
  ];

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedFilter = target.value as FilterOption;
      this.selectedFilterChange.emit(this.selectedFilter);
    }
  }
}
