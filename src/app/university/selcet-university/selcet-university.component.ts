import { Component, inject, OnInit } from '@angular/core';
import { UniversityService } from '../university.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
    selector: 'app-selcet-university',
    imports: [FormsModule, CommonModule],
    templateUrl: './selcet-university.component.html',
    styleUrl: './selcet-university.component.css'
})
export class SelcetUniversityComponent implements OnInit {

  faculties = [{ name: 'Business' }, { name: 'Engineering' }, { name: 'Science' }];
  departments: any[] = [];
  tracks: any[] = [];
  selectedFaculty!: string;
  selectedDepartment!: string;
  selectedTrack: any;
  route = inject(Router);

  constructor(private viewportScroller: ViewportScroller) {}
  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }

  onFacultyChange() {
    this.departments = this.getDepartmentsForFaculty(this.selectedFaculty);
    this.selectedDepartment = '';
    this.tracks = [];
  }

  onDepartmentChange() {
    this.tracks = this.getTracksForDepartment(this.selectedDepartment);
    this.selectedTrack = null;
  }

  onTrackSelect(track: any) {
    // Set selected track
    this.selectedTrack = track;
  }

  showCareerPath() {
    this.route.navigate(['/career-path'], {
      queryParams: { track: this.selectedTrack.name, description: this.selectedTrack.description }
    });
  }

  // Mock function to simulate fetching departments for selected faculty
  getDepartmentsForFaculty(faculty: string) {
    if (faculty === 'Engineering') {
      return [{ name: 'Computer Science' }, { name: 'Electrical Engineering' }];
    } else if (faculty === 'Science') {
      return [{ name: 'Physics' }, { name: 'Chemistry' }];
    } else if (faculty === 'Business') {
      return [{ name: 'BIS' }, { name: 'English' }, { name: 'Arabic' }];
    }
    return [];
  }

  // Mock function to simulate fetching tracks for selected department
  getTracksForDepartment(department: string) {
    if (department === 'Computer Science') {
      return [
        { name: 'Software Engineering', description: 'Learn to build software applications' },
        { name: 'Data Science', description: 'Analyze and interpret complex data' }
      ];
    } else if (department === 'Electrical Engineering') {
      return [
        { name: 'Circuit Design', description: 'Create electrical circuits and systems' },
        { name: 'Power Systems', description: 'Study power generation and distribution' }
      ];
    } else if (department === 'BIS') {
      return [
        { name: 'Front End', description: 'Study front end development' },
        { name: 'Data Analysis', description: 'Analyze and interpret complex data' }
      ];
    }
    return [];
  }
}
