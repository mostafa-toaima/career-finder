import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarerService } from '../../../services/carer.service';
type FilterOption = 'all' | 'completed' | 'in-progress' | 'not-started';

@Component({
  selector: 'path-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './path-header.component.html',
  styleUrl: './path-header.component.css'
})
export class PathHeaderComponent {
  @Input() title: string = '';
  @Input() selectedFilter: FilterOption = 'all';
  @Input() searchQuery: string = '';

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() selectedFilterChange = new EventEmitter<FilterOption>();

  filterOptions: any[] = []

  constructor(private careerService: CarerService) {
    this.filterOptions = this.careerService.filterOptions;
  }

  onSearchChange(value: string) {
    this.searchQueryChange.emit(value);

  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedFilter = target.value as FilterOption;
      this.selectedFilterChange.emit(this.selectedFilter);
    }
  }


}
