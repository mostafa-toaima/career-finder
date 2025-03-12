import { Component } from '@angular/core';
import { UniversityService } from '../university.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selcet-university',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './selcet-university.component.html',
  styleUrl: './selcet-university.component.css'
})
export class SelcetUniversityComponent {
  // faculties: any[] = [];
  // selectedFaculty = '';
  // sections: string[] = [];
  // selectedSection = '';

  // constructor(private dataService: UniversityService, private router: Router) { }

  // ngOnInit() {
  //   this.faculties = this.dataService.getFaculties();
  // }

  // onFacultyChange() {
  //   this.sections = this.dataService.getSections(this.selectedFaculty);
  //   this.selectedSection = '';
  // }

  // showCareerPaths() {
  //   this.router.navigate(['/career-paths'], {
  //     queryParams: {
  //       faculty: this.selectedFaculty,
  //       section: this.selectedSection
  //     }
  //   });
  // }


  faculties = [{ name: 'Engineering' }, { name: 'Science' }, { name: 'Arts' }];
  departments : any[] = [];
  tracks : any[] = [];
  selectedFaculty!: string;
  selectedDepartment!: string;
  selectedTrack: any;

  onFacultyChange() {
    // Fetch departments based on selected faculty
    this.departments = this.getDepartmentsForFaculty(this.selectedFaculty);
    this.selectedDepartment = '';
    this.tracks = [];
  }

  onDepartmentChange() {
    // Fetch available tracks for the selected department
    this.tracks = this.getTracksForDepartment(this.selectedDepartment);
    this.selectedTrack = null;
  }

  onTrackSelect(track: any) {
    // Set selected track
    this.selectedTrack = track;
  }

  showCareerPath() {
    // Show career path based on selected track
    alert(`Career path for ${this.selectedTrack.name}`);
  }

  // Mock function to simulate fetching departments for selected faculty
  getDepartmentsForFaculty(faculty: string) {
    if (faculty === 'Engineering') {
      return [{ name: 'Computer Science' }, { name: 'Electrical Engineering' }];
    } else if (faculty === 'Science') {
      return [{ name: 'Physics' }, { name: 'Chemistry' }];
    } else if (faculty === 'Arts') {
      return [{ name: 'History' }, { name: 'Literature' }];
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
    }
    return [];
  }
}
