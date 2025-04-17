import { Component, inject, OnInit } from '@angular/core';
import { UniversityService } from '../university.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ModelComponent } from './model/model.component';

@Component({
  selector: 'app-selcet-university',
  imports: [FormsModule, CommonModule, ModelComponent],
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
  displayFormAIModal: boolean = false;
  modalData: any;
  constructor(private viewportScroller: ViewportScroller) { }
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
  getDepartmentsForFaculty(faculty: string) {
    if (faculty === 'Engineering') {
      return [{ name: 'Computer Science' }, { name: 'Electrical Engineering' }];
    } else if (faculty === 'Science') {
      return [{ name: 'Physics' }, { name: 'Chemistry' }];
    } else if (faculty === 'Business') {
      return [{ name: 'Business Information Systems' }, { name: 'English' }, { name: 'Arabic' }];
    }
    return [];
  }
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
    } else if (department === 'Business Information Systems') {
      return [
        { name: 'Front End', description: 'Study front end development' },
        { name: 'Data Analysis', description: 'Analyze and interpret complex data' }
      ];
    }
    return [];
  }

  openHelperForm(selectedFaculty: any, selectedDepartment: any) {
    const values = {
      selectedFaculty,
      selectedDepartment,
    }
    this.modalData = values
    this.displayFormAIModal = true;
  }

}
